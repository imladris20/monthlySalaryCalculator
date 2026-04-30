document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calculator-form");
  const resultSection = document.getElementById("result-section");
  const hourlyWageEl = document.getElementById("hourly-wage");
  const overtimePayExactEl = document.getElementById("overtime-pay-exact");
  const insuranceDeductionEl = document.getElementById("insurance-deduction");
  const netSalaryRoundedEl = document.getElementById("net-salary-rounded");
  const recordsContainer = document.getElementById("records-container");
  const addRecordBtn = document.getElementById("add-record-btn");
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
    const bracketInfo = getInsuranceDeduction(salary);
    salaryInsurancePreview.textContent = `對應級距: $${bracketInfo.salary.toLocaleString()} | 勞保自付: $${bracketInfo.labor.toLocaleString()} | 健保自付: $${bracketInfo.health.toLocaleString()}`;
  });

  // 動態新增列
  addRecordBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2 record-row";
    row.innerHTML = `
            <input type="number" class="input input-bordered w-full focus:outline-primary overtime-minutes" placeholder="例如: 120" step="1" required min="1" max="240" />
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const salary = parseFloat(document.getElementById("monthly-salary").value);
    if (isNaN(salary)) return;

    // 計算平日每小時工資 (月薪 / 240)
    const hourlyWage = salary / 240;

    let totalExactPay = 0;

    // 取得所有分鐘數輸入框
    const minuteInputs = recordsContainer.querySelectorAll(".overtime-minutes");

    minuteInputs.forEach((input) => {
      const minutes = parseInt(input.value, 10);
      if (isNaN(minutes) || minutes <= 0) return;

      // 第1~120分鐘的加班費：時薪 * 4/3 * (分鐘數 / 60)
      // 第121~240分鐘的加班費：時薪 * 5/3 * (分鐘數 / 60)
      if (minutes <= 120) {
        totalExactPay += hourlyWage * (4 / 3) * (minutes / 60);
      } else {
        // 前 120 分鐘
        const firstTierPay = hourlyWage * (4 / 3) * (120 / 60);
        // 121 ~ 240 分鐘
        const secondTierPay = hourlyWage * (5 / 3) * ((minutes - 120) / 60);
        totalExactPay += firstTierPay + secondTierPay;
      }
    });

    // 取得勞健保扣除額
    const bracketInfo = getInsuranceDeduction(salary);
    const deduction = bracketInfo.total;

    // 計算最終實領薪資
    const netSalary = salary - deduction + Math.round(totalExactPay);

    // 顯示結果
    hourlyWageEl.textContent = `NT$ ${Math.round(hourlyWage)}`;

    // 顯示勞健保扣除額
    insuranceDeductionEl.textContent = `- NT$ ${deduction.toLocaleString()}`;

    // 顯示精確的小數加班費結果
    overtimePayExactEl.textContent = `+ NT$ ${totalExactPay.toFixed(2)}`;

    // 顯示最終實領薪資
    netSalaryRoundedEl.textContent = `NT$ ${netSalary.toLocaleString()}`;

    // 顯示結果區塊
    resultSection.classList.remove("hidden");

    // 重新觸發淡入動畫
    resultSection.classList.remove("animate-fade-in");
    void resultSection.offsetWidth; // 觸發重繪 (reflow)
    resultSection.classList.add("animate-fade-in");
  });
});
