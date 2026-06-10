document.addEventListener("DOMContentLoaded", () => {
  // 設定目前的計算模式
  localStorage.setItem("calculatorMode", "hourly");

  // 動態渲染級距表 (部分工時 + 一般級距)
  const allBrackets = [...PART_TIME_INSURANCE_BRACKETS, ...INSURANCE_BRACKETS];
  renderInsuranceTable(allBrackets);

  const form = document.getElementById("calculator-form");
  const resultSection = document.getElementById("result-section");
  const insuranceDeductionEl = document.getElementById("insurance-deduction");
  const netSalaryRoundedEl = document.getElementById("net-salary-rounded");
  const employerPensionEl = document.getElementById("employer-pension");
  const grossSalaryEl = document.getElementById("gross-salary");

  const hourlyWageInput = document.getElementById("hourly-wage");
  const totalHoursInput = document.getElementById("total-hours");
  const salaryInsurancePreview = document.getElementById(
    "salary-insurance-preview",
  );
  const recordsContainer = document.getElementById("records-container");
  const addRecordBtn = document.getElementById("add-record-btn");
  const leavesContainer = document.getElementById("leaves-container");
  const addLeaveBtn = document.getElementById("add-leave-btn");
  const overtimePayExactEl = document.getElementById("overtime-pay-exact");

  function updatePreview() {
    const hourlyWage = parseFloat(hourlyWageInput.value);
    const totalHours = parseFloat(totalHoursInput.value);

    if (
      isNaN(hourlyWage) ||
      isNaN(totalHours) ||
      hourlyWage <= 0 ||
      totalHours <= 0
    ) {
      salaryInsurancePreview.textContent = "";
      return;
    }

    const estimatedSalary = hourlyWage * totalHours;
    const bracketInfo = getInsuranceDeduction(estimatedSalary, true);

    salaryInsurancePreview.innerHTML = `
      <div class="mb-1 text-primary font-bold">預估月薪 (不含加班): $${Math.round(estimatedSalary).toLocaleString()}元</div>
      <div class="mb-1">勞保自付: $${bracketInfo.labor.toLocaleString()}，健保自付: $${bracketInfo.health.toLocaleString()}</div>
    `;

    document.getElementById("bracket-label").textContent =
      `您的級距：NT$ ${bracketInfo.salary.toLocaleString()}`;

    highlightBracketInTable(bracketInfo.salary);
  }

  hourlyWageInput.addEventListener("input", updatePreview);
  totalHoursInput.addEventListener("input", updatePreview);

  // 動態新增列
  addRecordBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2 record-row";
    row.innerHTML = `
            <input type="number" class="input input-bordered w-full focus:outline-primary overtime-minutes" placeholder="例如: 120" step="1" min="0" max="240" />
            <button type="button" class="btn btn-square btn-error btn-outline delete-btn" title="刪除">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        `;
    recordsContainer.appendChild(row);
    updateDeleteButtons();
  });

  // 刪除列 (使用事件委派)
  recordsContainer.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      deleteBtn.closest(".record-row").remove();
      updateDeleteButtons();
    }
  });

  function updateDeleteButtons() {
    const deleteBtns = recordsContainer.querySelectorAll(".delete-btn");
    if (deleteBtns.length <= 1) {
      deleteBtns.forEach((btn) => (btn.disabled = true));
    } else {
      deleteBtns.forEach((btn) => (btn.disabled = false));
    }
  }

  // 動態新增請假列
  addLeaveBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2 leave-row";
    row.innerHTML = `
            <select class="select select-bordered focus:outline-primary leave-type">
                <option value="sick">病假 (半薪)</option>
                <option value="personal">事假 (無薪)</option>
            </select>
            <label class="input input-bordered flex items-center gap-2 grow focus-within:outline-primary">
                <input type="number" class="grow leave-hours" placeholder="0" min="0" step="0.5" />
                <span class="text-base-content/50">小時</span>
            </label>
            <button type="button" class="btn btn-square btn-error btn-outline delete-leave-btn" title="刪除">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        `;
    leavesContainer.appendChild(row);
    updateLeaveDeleteButtons();
  });

  // 刪除請假列 (使用事件委派)
  leavesContainer.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-leave-btn");
    if (deleteBtn) {
      deleteBtn.closest(".leave-row").remove();
      updateLeaveDeleteButtons();
    }
  });

  function updateLeaveDeleteButtons() {
    const deleteBtns = leavesContainer.querySelectorAll(".delete-leave-btn");
    if (deleteBtns.length <= 1) {
      deleteBtns.forEach((btn) => (btn.disabled = true));
    } else {
      deleteBtns.forEach((btn) => (btn.disabled = false));
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const hourlyWage = parseFloat(hourlyWageInput.value);
    const totalHours = parseFloat(totalHoursInput.value);

    if (isNaN(hourlyWage) || isNaN(totalHours)) return;

    // 基本薪資 (不含加班)
    const baseSalary = hourlyWage * totalHours;

    // 計算加班費
    // Labor Standards Act overtime multipliers. Payroll systems use the
    // rounded statutory rates 1.34 / 1.67 (not the exact fractions 4/3, 5/3),
    // so we match that to align with real pay slips.
    const OT_TIER1_MULTIPLIER = 1.34; // first 2 hours per day
    const OT_TIER2_MULTIPLIER = 1.67; // beyond 2 hours per day
    const tier1RatePerMin = (hourlyWage * OT_TIER1_MULTIPLIER) / 60;
    const tier2RatePerMin = (hourlyWage * OT_TIER2_MULTIPLIER) / 60;

    let totalOvertimePay = 0;
    let totalTier1Mins = 0;
    let totalTier2Mins = 0;

    const minuteInputs = recordsContainer.querySelectorAll(".overtime-minutes");
    minuteInputs.forEach((input) => {
      const minutes = parseInt(input.value, 10);
      if (isNaN(minutes) || minutes <= 0) return;

      if (minutes <= 120) {
        totalTier1Mins += minutes;
      } else {
        totalTier1Mins += 120;
        totalTier2Mins += minutes - 120;
      }
    });

    totalOvertimePay =
      totalTier1Mins * tier1RatePerMin + totalTier2Mins * tier2RatePerMin;
    // Pay slips truncate the overtime total down to whole dollars (floor),
    // not round-half-up.
    const overtimePayRounded = Math.floor(totalOvertimePay);

    const grossSalaryTotal = Math.round(baseSalary) + overtimePayRounded;
    const bracketInfo = getInsuranceDeduction(grossSalaryTotal, true);
    const deduction = bracketInfo.total;

    // 逐筆計算請假扣款 (病假半薪，事假無薪)。每筆請假以時薪計算後
    // 各自四捨五入再加總，與薪資單逐筆計算的算法一致。
    let leaveDeductionTotal = 0;
    let totalSickHours = 0;
    let totalPersonalHours = 0;
    const leaveRows = leavesContainer.querySelectorAll(".leave-row");

    leaveRows.forEach((row) => {
      const hours = parseFloat(row.querySelector(".leave-hours").value) || 0;
      if (hours <= 0) return;

      const type = row.querySelector(".leave-type").value;
      // 病假給半薪 (扣半薪)，事假無薪 (扣全薪)
      const payRatio = type === "sick" ? 0.5 : 1;
      leaveDeductionTotal += Math.round(hourlyWage * hours * payRatio);

      if (type === "sick") totalSickHours += hours;
      else totalPersonalHours += hours;
    });

    const netSalary = grossSalaryTotal - deduction - leaveDeductionTotal;

    // 顯示數值
    insuranceDeductionEl.textContent = `- NT$ ${deduction.toLocaleString()}`;
    document.getElementById("bracket-label").textContent =
      `您的級距：NT$ ${bracketInfo.salary.toLocaleString()}`;

    // 顯示請假扣款
    document.getElementById("leave-deduction").textContent =
      `- NT$ ${leaveDeductionTotal.toLocaleString()}`;
    const leaveDescText = [];
    if (totalSickHours > 0) leaveDescText.push(`病假 ${totalSickHours}h`);
    if (totalPersonalHours > 0)
      leaveDescText.push(`事假 ${totalPersonalHours}h`);
    document.getElementById("leave-desc").textContent =
      leaveDescText.length > 0 ? leaveDescText.join("、") : "";

    // 顯示加班費結果 (與帳面薪資一致，無條件捨去到整數元)
    overtimePayExactEl.textContent = `+ NT$ ${overtimePayRounded.toLocaleString()}`;

    document.getElementById("overtime-tier1-desc").textContent =
      `1~120分: 每分鐘 $${tier1RatePerMin.toFixed(2)} (共 ${totalTier1Mins} 分鐘)`;
    document.getElementById("overtime-tier2-desc").textContent =
      `121~240分: 每分鐘 $${tier2RatePerMin.toFixed(2)} (共 ${totalTier2Mins} 分鐘)`;

    netSalaryRoundedEl.textContent = `NT$ ${netSalary.toLocaleString()}`;
    employerPensionEl.textContent = `NT$ ${bracketInfo.pension.toLocaleString()}`;

    resultSection.classList.remove("animate-fade-in");
    void resultSection.offsetWidth;
    resultSection.classList.add("animate-fade-in");
  });

  // 清除：重置所有輸入與計算結果回到初始狀態
  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", () => {
    // 清空時薪、總工時
    hourlyWageInput.value = "";
    totalHoursInput.value = "";
    salaryInsurancePreview.textContent = "";

    // 動態列表只保留第一列並清空其內容
    recordsContainer.querySelectorAll(".record-row").forEach((row, i) => {
      if (i === 0) row.querySelector(".overtime-minutes").value = "";
      else row.remove();
    });
    leavesContainer.querySelectorAll(".leave-row").forEach((row, i) => {
      if (i === 0) {
        row.querySelector(".leave-hours").value = "";
        row.querySelector(".leave-type").value = "sick";
      } else {
        row.remove();
      }
    });
    updateDeleteButtons();
    updateLeaveDeleteButtons();

    // 結果區歸零
    insuranceDeductionEl.textContent = "- NT$ 0";
    document.getElementById("leave-deduction").textContent = "- NT$ 0";
    document.getElementById("leave-desc").textContent = "";
    overtimePayExactEl.textContent = "+ NT$ 0";
    document.getElementById("overtime-tier1-desc").textContent = "";
    document.getElementById("overtime-tier2-desc").textContent = "";
    document.getElementById("bracket-label").textContent = "";
    netSalaryRoundedEl.textContent = "NT$ 0";
    employerPensionEl.textContent = "NT$ 0";
  });
});
