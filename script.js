document.addEventListener("DOMContentLoaded", () => {
  // 設定目前的計算模式
  localStorage.setItem("calculatorMode", "monthly");

  // 動態渲染級距表 (預設月薪制)
  renderInsuranceTable(INSURANCE_BRACKETS);

  const form = document.getElementById("calculator-form");
  const resultSection = document.getElementById("result-section");
  const overtimePayExactEl = document.getElementById("overtime-pay-exact");
  const insuranceDeductionEl = document.getElementById("insurance-deduction");
  const netSalaryRoundedEl = document.getElementById("net-salary-rounded");
  const employerPensionEl = document.getElementById("employer-pension");
  const recordsContainer = document.getElementById("records-container");
  const addRecordBtn = document.getElementById("add-record-btn");
  const leavesContainer = document.getElementById("leaves-container");
  const addLeaveBtn = document.getElementById("add-leave-btn");
  const monthlySalaryInput = document.getElementById("monthly-salary");
  const salaryInsurancePreview = document.getElementById(
    "salary-insurance-preview",
  );

  // 即時預覽勞健保扣除額
  monthlySalaryInput.addEventListener("input", (e) => {
    const salary = parseFloat(e.target.value);
    if (isNaN(salary) || salary <= 0) {
      salaryInsurancePreview.textContent = "";
      return;
    }
    const hourlyWage = (salary / 240).toFixed(1);
    const bracketInfo = getInsuranceDeduction(salary);
    salaryInsurancePreview.innerHTML = `
      <div class="mb-1">平日時薪: $${hourlyWage}元</div>
      <div class="mb-1">勞保自付: $${bracketInfo.labor.toLocaleString()}，健保自付: $${bracketInfo.health.toLocaleString()}</div>
    `;

    document.getElementById("bracket-label").textContent =
      `您的級距：NT$ ${bracketInfo.salary.toLocaleString()}`;

    // Highlight the bracket in the modal table
    highlightBracketInTable(bracketInfo.salary);
  });

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
    // 如果只剩一列，則禁用刪除按鈕
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
    // 如果只剩一列，則禁用刪除按鈕
    if (deleteBtns.length <= 1) {
      deleteBtns.forEach((btn) => (btn.disabled = true));
    } else {
      deleteBtns.forEach((btn) => (btn.disabled = false));
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const salary = parseFloat(document.getElementById("monthly-salary").value);
    if (isNaN(salary)) return;

    // 計算平日每小時工資 (月薪 / 240)
    const hourlyWage = salary / 240;
    // Labor Standards Act overtime multipliers. Payroll systems use the
    // rounded statutory rates 1.34 / 1.67 (not the exact fractions 4/3, 5/3),
    // so we match that to align with real pay slips.
    const OT_TIER1_MULTIPLIER = 1.34; // first 2 hours per day
    const OT_TIER2_MULTIPLIER = 1.67; // beyond 2 hours per day
    const tier1RatePerMin = (hourlyWage * OT_TIER1_MULTIPLIER) / 60;
    const tier2RatePerMin = (hourlyWage * OT_TIER2_MULTIPLIER) / 60;

    let totalExactPay = 0;
    let totalTier1Mins = 0;
    let totalTier2Mins = 0;

    // 取得所有分鐘數輸入框
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

    totalExactPay =
      totalTier1Mins * tier1RatePerMin + totalTier2Mins * tier2RatePerMin;
    // Pay slips truncate the overtime total down to whole dollars (floor),
    // not round-half-up.
    const overtimePayRounded = Math.floor(totalExactPay);

    // 取得勞健保扣除額
    const bracketInfo = getInsuranceDeduction(salary, false);
    const deduction = bracketInfo.total;

    // 取得伙食費 (免稅額)，並把月薪拆成課稅 / 非課稅兩部分。
    // Payroll splits the salary into a taxable portion (salary - meal
    // allowance) and a non-taxable portion (meal allowance), then computes
    // each leave deduction on both portions separately and rounds each.
    const mealAllowance =
      parseFloat(document.getElementById("meal-allowance").value) || 0;
    const taxableSalary = salary - mealAllowance;
    const taxableHourlyWage = taxableSalary / 240;
    const nonTaxableHourlyWage = mealAllowance / 240;

    // 逐筆計算請假扣款 (病假半薪，事假無薪)。每筆請假分別就課稅、
    // 非課稅各自四捨五入後再加總，與薪資單算法一致。
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
      const weightedHours = hours * payRatio;

      const taxablePart = Math.round(taxableHourlyWage * weightedHours);
      const nonTaxablePart = Math.round(nonTaxableHourlyWage * weightedHours);
      leaveDeductionTotal += taxablePart + nonTaxablePart;

      if (type === "sick") totalSickHours += hours;
      else totalPersonalHours += hours;
    });

    // 計算最終實領薪資
    const netSalary =
      salary - deduction - leaveDeductionTotal + overtimePayRounded;

    // 顯示勞健保扣除額
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

    // 顯示加班費結果 (與實領一致，無條件捨去到整數元)
    overtimePayExactEl.textContent = `+ NT$ ${overtimePayRounded.toLocaleString()}`;
    document.getElementById("overtime-tier1-desc").textContent =
      `1~120分: 每分鐘 $${tier1RatePerMin.toFixed(2)} (共 ${totalTier1Mins} 分鐘)`;
    document.getElementById("overtime-tier2-desc").textContent =
      `121~240分: 每分鐘 $${tier2RatePerMin.toFixed(2)} (共 ${totalTier2Mins} 分鐘)`;

    // 顯示最終實領薪資
    netSalaryRoundedEl.textContent = `NT$ ${netSalary.toLocaleString()}`;

    // 顯示雇主提撥勞退
    employerPensionEl.textContent = `NT$ ${bracketInfo.pension.toLocaleString()}`;

    // 重新觸發淡入動畫
    resultSection.classList.remove("animate-fade-in");
    void resultSection.offsetWidth; // 觸發重繪 (reflow)
    resultSection.classList.add("animate-fade-in");
  });

  // 清除：重置所有輸入與計算結果回到初始狀態
  const resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", () => {
    // 清空月薪、伙食費恢復預設
    monthlySalaryInput.value = "";
    document.getElementById("meal-allowance").value = "3000";
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
