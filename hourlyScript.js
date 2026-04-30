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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const hourlyWage = parseFloat(hourlyWageInput.value);
    const totalHours = parseFloat(totalHoursInput.value);

    if (isNaN(hourlyWage) || isNaN(totalHours)) return;

    // 基本薪資 (不含加班)
    const baseSalary = hourlyWage * totalHours;

    // 計算加班費
    const tier1RatePerMin = (hourlyWage * (4 / 3)) / 60;
    const tier2RatePerMin = (hourlyWage * (5 / 3)) / 60;

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

    const grossSalaryTotal = Math.round(baseSalary + totalOvertimePay);
    const bracketInfo = getInsuranceDeduction(grossSalaryTotal, true);
    const deduction = bracketInfo.total;
    const netSalary = grossSalaryTotal - deduction;

    // 顯示數值
    insuranceDeductionEl.textContent = `- NT$ ${deduction.toLocaleString()}`;
    document.getElementById("bracket-label").textContent =
      `您的級距：NT$ ${bracketInfo.salary.toLocaleString()}`;
    overtimePayExactEl.textContent = `+ NT$ ${totalOvertimePay.toFixed(2)}`;

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
});
