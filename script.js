document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calculator-form");
  const resultSection = document.getElementById("result-section");
  const overtimePayExactEl = document.getElementById("overtime-pay-exact");
  const insuranceDeductionEl = document.getElementById("insurance-deduction");
  const netSalaryRoundedEl = document.getElementById("net-salary-rounded");
  const employerPensionEl = document.getElementById("employer-pension");
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
    const hourlyWage = Math.round(salary / 240);
    const bracketInfo = getInsuranceDeduction(salary);
    salaryInsurancePreview.textContent = `平日時薪: $${hourlyWage} | 對應級距: $${bracketInfo.salary.toLocaleString()} | 勞保自付: $${bracketInfo.labor.toLocaleString()} | 健保自付: $${bracketInfo.health.toLocaleString()} | 雇主提撥勞退: $${bracketInfo.pension.toLocaleString()}`;
    
    // Highlight the bracket in the modal table
    highlightBracketInTable(bracketInfo.salary);
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
    const tier1RatePerMin = (hourlyWage * (4 / 3)) / 60;
    const tier2RatePerMin = (hourlyWage * (5 / 3)) / 60;

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

    // 取得勞健保扣除額
    const bracketInfo = getInsuranceDeduction(salary);
    const deduction = bracketInfo.total;

    // 計算最終實領薪資
    const netSalary = salary - deduction + Math.round(totalExactPay);

    // 顯示勞健保扣除額
    insuranceDeductionEl.textContent = `- NT$ ${deduction.toLocaleString()}`;

    // 顯示精確的小數加班費結果
    overtimePayExactEl.textContent = `+ NT$ ${totalExactPay.toFixed(2)}`;
    document.getElementById("overtime-tier1-desc").textContent =
      `1~120分: 每分鐘 $${tier1RatePerMin.toFixed(2)} (共 ${totalTier1Mins} 分鐘)`;
    document.getElementById("overtime-tier2-desc").textContent =
      `121~240分: 每分鐘 $${tier2RatePerMin.toFixed(2)} (共 ${totalTier2Mins} 分鐘)`;

    // 顯示最終實領薪資
    netSalaryRoundedEl.textContent = `NT$ ${netSalary.toLocaleString()}`;

    // 顯示雇主提撥勞退
    employerPensionEl.textContent = `NT$ ${bracketInfo.pension.toLocaleString()}`;

    // 顯示結果區塊
    resultSection.classList.remove("hidden");

    // 重新觸發淡入動畫
    resultSection.classList.remove("animate-fade-in");
    void resultSection.offsetWidth; // 觸發重繪 (reflow)
    resultSection.classList.add("animate-fade-in");
  });
});

function highlightBracketInTable(bracketSalary) {
  const tbody = document.getElementById("bracket_tbody");
  if (!tbody) return;
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row) => {
    // reset background
    row.classList.remove("bg-warning/20", "font-bold");
    row.querySelectorAll("td").forEach((td) => td.classList.remove("bg-warning/50", "font-black", "text-warning-content"));

    const rowSalaryStr = row.cells[0].textContent.replace(/,/g, "");
    const rowSalary = parseInt(rowSalaryStr, 10);
    
    if (rowSalary === bracketSalary) {
      row.classList.add("bg-warning/20", "font-bold");
      // Highlight specific columns: 勞退(idx 3), 勞保自付(idx 5), 健保自付(idx 6), 合計自付(idx 7)
      if (row.cells.length >= 8) {
        [3, 5, 6, 7].forEach(idx => {
          row.cells[idx].classList.add("bg-warning/50", "font-black", "text-warning-content");
        });
      }
    }
  });
}

// Ensure it's available globally for the HTML onclick handler
window.scrollToHighlightedRow = function () {
  setTimeout(() => {
    // Need to escape the forward slash in CSS selectors
    const highlighted = document.querySelector("#bracket_tbody tr.bg-warning\\\\/20");
    if (highlighted) {
      highlighted.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
};
