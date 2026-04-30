/**
 * 115年最新！勞保、健保、勞退級距及保費級距一覽表
 * 來源：使用者提供之 insurance.txt / table_rows.html
 */
const INSURANCE_BRACKETS = [
  { salary: 29500, employerLabor: 2581, employerHealth: 1428, pension: 1770, employerTotal: 5779, labor: 738, health: 458, total: 1196 },
  { salary: 30300, employerLabor: 2651, employerHealth: 1466, pension: 1818, employerTotal: 5935, labor: 758, health: 470, total: 1228 },
  { salary: 31800, employerLabor: 2783, employerHealth: 1539, pension: 1908, employerTotal: 6230, labor: 795, health: 493, total: 1288 },
  { salary: 33300, employerLabor: 2914, employerHealth: 1611, pension: 1998, employerTotal: 6523, labor: 833, health: 516, total: 1349 },
  { salary: 34800, employerLabor: 3045, employerHealth: 1684, pension: 2088, employerTotal: 6817, labor: 870, health: 540, total: 1410 },
  { salary: 36300, employerLabor: 3176, employerHealth: 1757, pension: 2178, employerTotal: 7111, labor: 908, health: 563, total: 1471 },
  { salary: 38200, employerLabor: 3342, employerHealth: 1849, pension: 2292, employerTotal: 7483, labor: 955, health: 592, total: 1547 },
  { salary: 40100, employerLabor: 3509, employerHealth: 1940, pension: 2406, employerTotal: 7855, labor: 1002, health: 622, total: 1624 },
  { salary: 42000, employerLabor: 3675, employerHealth: 2032, pension: 2520, employerTotal: 8227, labor: 1050, health: 651, total: 1701 },
  { salary: 43900, employerLabor: 3841, employerHealth: 2124, pension: 2634, employerTotal: 8599, labor: 1098, health: 681, total: 1779 },
  { salary: 45800, employerLabor: 4008, employerHealth: 2216, pension: 2748, employerTotal: 8972, labor: 1145, health: 710, total: 1855 },
  { salary: 48200, employerLabor: 4008, employerHealth: 2332, pension: 2892, employerTotal: 9232, labor: 1145, health: 748, total: 1893 },
  { salary: 50600, employerLabor: 4008, employerHealth: 2449, pension: 3036, employerTotal: 9493, labor: 1145, health: 785, total: 1930 },
  { salary: 53000, employerLabor: 4008, employerHealth: 2565, pension: 3180, employerTotal: 9753, labor: 1145, health: 822, total: 1967 },
  { salary: 55400, employerLabor: 4008, employerHealth: 2681, pension: 3324, employerTotal: 10013, labor: 1145, health: 859, total: 2004 },
  { salary: 57800, employerLabor: 4008, employerHealth: 2797, pension: 3468, employerTotal: 10273, labor: 1145, health: 896, total: 2041 },
  { salary: 60800, employerLabor: 4008, employerHealth: 2942, pension: 3648, employerTotal: 10598, labor: 1145, health: 943, total: 2088 },
  { salary: 63800, employerLabor: 4008, employerHealth: 3087, pension: 3828, employerTotal: 10923, labor: 1145, health: 990, total: 2135 },
  { salary: 66800, employerLabor: 4008, employerHealth: 3233, pension: 4008, employerTotal: 11249, labor: 1145, health: 1036, total: 2181 },
  { salary: 69800, employerLabor: 4008, employerHealth: 3378, pension: 4188, employerTotal: 11574, labor: 1145, health: 1083, total: 2228 },
  { salary: 72800, employerLabor: 4008, employerHealth: 3523, pension: 4368, employerTotal: 11899, labor: 1145, health: 1129, total: 2274 },
  { salary: 76500, employerLabor: 4008, employerHealth: 3702, pension: 4590, employerTotal: 12300, labor: 1145, health: 1187, total: 2332 },
  { salary: 80200, employerLabor: 4008, employerHealth: 3881, pension: 4812, employerTotal: 12701, labor: 1145, health: 1244, total: 2389 },
  { salary: 83900, employerLabor: 4008, employerHealth: 4060, pension: 5034, employerTotal: 13102, labor: 1145, health: 1301, total: 2446 },
  { salary: 87600, employerLabor: 4008, employerHealth: 4239, pension: 5256, employerTotal: 13503, labor: 1145, health: 1359, total: 2504 },
  { salary: 92100, employerLabor: 4008, employerHealth: 4457, pension: 5526, employerTotal: 13991, labor: 1145, health: 1428, total: 2573 },
  { salary: 96600, employerLabor: 4008, employerHealth: 4675, pension: 5796, employerTotal: 14479, labor: 1145, health: 1498, total: 2643 },
  { salary: 101100, employerLabor: 4008, employerHealth: 4892, pension: 6066, employerTotal: 14966, labor: 1145, health: 1568, total: 2713 },
  { salary: 105600, employerLabor: 4008, employerHealth: 5110, pension: 6336, employerTotal: 15454, labor: 1145, health: 1638, total: 2783 },
  { salary: 110100, employerLabor: 4008, employerHealth: 5328, pension: 6606, employerTotal: 15942, labor: 1145, health: 1708, total: 2853 },
  { salary: 115500, employerLabor: 4008, employerHealth: 5589, pension: 6930, employerTotal: 16527, labor: 1145, health: 1791, total: 2936 },
  { salary: 120900, employerLabor: 4008, employerHealth: 5850, pension: 7254, employerTotal: 17112, labor: 1145, health: 1875, total: 3020 },
  { salary: 126300, employerLabor: 4008, employerHealth: 6112, pension: 7578, employerTotal: 17698, labor: 1145, health: 1959, total: 3104 },
  { salary: 131700, employerLabor: 4008, employerHealth: 6373, pension: 7902, employerTotal: 18283, labor: 1145, health: 2043, total: 3188 },
  { salary: 137100, employerLabor: 4008, employerHealth: 6634, pension: 8226, employerTotal: 18868, labor: 1145, health: 2126, total: 3271 },
  { salary: 142500, employerLabor: 4008, employerHealth: 6896, pension: 8550, employerTotal: 19454, labor: 1145, health: 2210, total: 3355 },
  { salary: 147900, employerLabor: 4008, employerHealth: 7157, pension: 8874, employerTotal: 20039, labor: 1145, health: 2294, total: 3439 },
  { salary: 150000, employerLabor: 4008, employerHealth: 7259, pension: 9000, employerTotal: 20267, labor: 1145, health: 2327, total: 3472 },
  { salary: 156400, employerLabor: 4008, employerHealth: 7568, pension: 9000, employerTotal: 20576, labor: 1145, health: 2426, total: 3571 },
  { salary: 162800, employerLabor: 4008, employerHealth: 7878, pension: 9000, employerTotal: 20886, labor: 1145, health: 2525, total: 3670 },
  { salary: 169200, employerLabor: 4008, employerHealth: 8188, pension: 9000, employerTotal: 21196, labor: 1145, health: 2624, total: 3769 },
  { salary: 175600, employerLabor: 4008, employerHealth: 8497, pension: 9000, employerTotal: 21505, labor: 1145, health: 2724, total: 3869 },
  { salary: 182000, employerLabor: 4008, employerHealth: 8807, pension: 9000, employerTotal: 21815, labor: 1145, health: 2823, total: 3968 },
  { salary: 189500, employerLabor: 4008, employerHealth: 9170, pension: 9000, employerTotal: 22178, labor: 1145, health: 2939, total: 4084 },
  { salary: 197000, employerLabor: 4008, employerHealth: 9533, pension: 9000, employerTotal: 22541, labor: 1145, health: 3055, total: 4200 },
  { salary: 204500, employerLabor: 4008, employerHealth: 9896, pension: 9000, employerTotal: 22904, labor: 1145, health: 3172, total: 4317 },
  { salary: 212000, employerLabor: 4008, employerHealth: 10259, pension: 9000, employerTotal: 23267, labor: 1145, health: 3288, total: 4433 },
  { salary: 219500, employerLabor: 4008, employerHealth: 10622, pension: 9000, employerTotal: 23630, labor: 1145, health: 3404, total: 4549 },
  { salary: 228200, employerLabor: 4008, employerHealth: 11043, pension: 9000, employerTotal: 24051, labor: 1145, health: 3539, total: 4684 },
  { salary: 236900, employerLabor: 4008, employerHealth: 11464, pension: 9000, employerTotal: 24472, labor: 1145, health: 3674, total: 4819 },
  { salary: 245600, employerLabor: 4008, employerHealth: 11885, pension: 9000, employerTotal: 24893, labor: 1145, health: 3809, total: 4954 },
  { salary: 254300, employerLabor: 4008, employerHealth: 12306, pension: 9000, employerTotal: 25314, labor: 1145, health: 3944, total: 5089 },
  { salary: 263000, employerLabor: 4008, employerHealth: 12727, pension: 9000, employerTotal: 25735, labor: 1145, health: 4079, total: 5224 },
  { salary: 273000, employerLabor: 4008, employerHealth: 13211, pension: 9000, employerTotal: 26219, labor: 1145, health: 4234, total: 5379 },
  { salary: 283000, employerLabor: 4008, employerHealth: 13695, pension: 9000, employerTotal: 26703, labor: 1145, health: 4389, total: 5534 },
  { salary: 293000, employerLabor: 4008, employerHealth: 14179, pension: 9000, employerTotal: 27187, labor: 1145, health: 4544, total: 5689 },
  { salary: 303000, employerLabor: 4008, employerHealth: 14663, pension: 9000, employerTotal: 27671, labor: 1145, health: 4700, total: 5845 },
  { salary: 313000, employerLabor: 4008, employerHealth: 15146, pension: 9000, employerTotal: 28154, labor: 1145, health: 4855, total: 6000 },
];

/**
 * 115年最新！部分工時勞工級距表 (低於基本工資 29,500 元者)
 * 勞保費率 12.5% (自付 20%, 雇主 70%)
 * 健保費率 5.17% (自付 30%, 雇主 60% * 1.56 平均眷口數)
 * 健保最低投保級距仍為 29,500 元
 */
const PART_TIME_INSURANCE_BRACKETS = [
  { salary: 11100, employerLabor: 971, employerHealth: 1428, pension: 666, employerTotal: 3065, labor: 278, health: 458, total: 736 },
  { salary: 12540, employerLabor: 1097, employerHealth: 1428, pension: 752, employerTotal: 3277, labor: 314, health: 458, total: 772 },
  { salary: 13500, employerLabor: 1181, employerHealth: 1428, pension: 810, employerTotal: 3419, labor: 338, health: 458, total: 796 },
  { salary: 15840, employerLabor: 1386, employerHealth: 1428, pension: 950, employerTotal: 3764, labor: 396, health: 458, total: 854 },
  { salary: 16500, employerLabor: 1444, employerHealth: 1428, pension: 990, employerTotal: 3862, labor: 413, health: 458, total: 871 },
  { salary: 17600, employerLabor: 1540, employerHealth: 1428, pension: 1056, employerTotal: 4024, labor: 440, health: 458, total: 898 },
  { salary: 19200, employerLabor: 1680, employerHealth: 1428, pension: 1152, employerTotal: 4260, labor: 480, health: 458, total: 938 },
  { salary: 20100, employerLabor: 1759, employerHealth: 1428, pension: 1206, employerTotal: 4393, labor: 503, health: 458, total: 961 },
  { salary: 21000, employerLabor: 1838, employerHealth: 1428, pension: 1260, employerTotal: 4526, labor: 525, health: 458, total: 983 },
  { salary: 22000, employerLabor: 1925, employerHealth: 1428, pension: 1320, employerTotal: 4673, labor: 550, health: 458, total: 1008 },
  { salary: 23100, employerLabor: 2021, employerHealth: 1428, pension: 1386, employerTotal: 4835, labor: 578, health: 458, total: 1036 },
  { salary: 24000, employerLabor: 2100, employerHealth: 1428, pension: 1440, employerTotal: 4968, labor: 600, health: 458, total: 1058 },
  { salary: 25200, employerLabor: 2205, employerHealth: 1428, pension: 1512, employerTotal: 5145, labor: 630, health: 458, total: 1088 },
  { salary: 26400, employerLabor: 2310, employerHealth: 1428, pension: 1584, employerTotal: 5322, labor: 660, health: 458, total: 1118 },
  { salary: 27600, employerLabor: 2415, employerHealth: 1428, pension: 1656, employerTotal: 5499, labor: 690, health: 458, total: 1148 },
  { salary: 28800, employerLabor: 2520, employerHealth: 1428, pension: 1728, employerTotal: 5676, labor: 720, health: 458, total: 1178 },
];

/**
 * 取得指定帳面薪資的勞健保扣除額
 * @param {number} nominalSalary 帳面薪資
 * @param {boolean} isPartTime 是否為部分工時 (時薪制)
 * @returns {object} 包含該級距資訊的物件
 */
function getInsuranceDeduction(nominalSalary, isPartTime = false) {
  const brackets = isPartTime ? [...PART_TIME_INSURANCE_BRACKETS, ...INSURANCE_BRACKETS] : INSURANCE_BRACKETS;
  
  // 預設最低級距
  if (nominalSalary <= brackets[0].salary) {
    return brackets[0];
  }

  // 預設最高級距
  if (
    nominalSalary >= brackets[brackets.length - 1].salary
  ) {
    return brackets[brackets.length - 1];
  }

  // 尋找符合的級距 (大於等於 nominalSalary 的最小級距)
  for (let i = 0; i < brackets.length; i++) {
    if (brackets[i].salary >= nominalSalary) {
      return brackets[i];
    }
  }

  return brackets[brackets.length - 1];
}

/**
 * 在級距表中高亮顯示指定的級距
 * @param {number} bracketSalary 
 */
function highlightBracketInTable(bracketSalary) {
  const tbody = document.getElementById("bracket_tbody");
  if (!tbody) return;
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row) => {
    // reset background
    row.classList.remove("bg-warning/20", "font-bold");
    row
      .querySelectorAll("td")
      .forEach((td) =>
        td.classList.remove(
          "bg-warning/50",
          "font-black",
          "text-warning-content",
        ),
      );

    const rowSalaryStr = row.cells[0].textContent.replace(/,/g, "");
    const rowSalary = parseInt(rowSalaryStr, 10);

    if (rowSalary === bracketSalary) {
      row.classList.add("bg-warning/20", "font-bold");
      // Highlight specific columns: 勞退(idx 3), 勞保自付(idx 5), 健保自付(idx 6), 合計自付(idx 7)
      if (row.cells.length >= 8) {
        [3, 5, 6, 7].forEach((idx) => {
          row.cells[idx].classList.add(
            "bg-warning/50",
            "font-black",
            "text-warning-content",
          );
        });
      }
    }
  });
}

// Ensure it's available globally for the HTML onclick handler
window.scrollToHighlightedRow = function () {
  setTimeout(() => {
    // Need to escape the forward slash in CSS selectors
    const highlighted = document.querySelector(
      "#bracket_tbody tr.bg-warning\\\\/20",
    );
    if (highlighted) {
      highlighted.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
};

/**
 * 動態渲染級距表內容
 * @param {Array} brackets 級距資料陣列
 */
function renderInsuranceTable(brackets) {
  const tbody = document.getElementById("bracket_tbody");
  if (!tbody || !brackets) return;

  tbody.innerHTML = brackets.map((b) => `
    <tr>
      <td>${b.salary.toLocaleString()}</td>
      <td>${b.employerLabor.toLocaleString()}</td>
      <td>${b.employerHealth.toLocaleString()}</td>
      <td>${b.pension.toLocaleString()}</td>
      <td>${b.employerTotal.toLocaleString()}</td>
      <td>${b.labor.toLocaleString()}</td>
      <td>${b.health.toLocaleString()}</td>
      <td>${b.total.toLocaleString()}</td>
    </tr>
  `).join("");
}
