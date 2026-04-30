/**
 * 115年最新！勞保、健保、勞退級距及保費級距一覽表
 * 來源：使用者提供之 insurance.txt
 */
const INSURANCE_BRACKETS = [
  { salary: 29500, labor: 738, health: 458, total: 1196 },
  { salary: 30300, labor: 758, health: 470, total: 1228 },
  { salary: 31800, labor: 795, health: 493, total: 1288 },
  { salary: 33300, labor: 833, health: 516, total: 1349 },
  { salary: 34800, labor: 870, health: 540, total: 1410 },
  { salary: 36300, labor: 908, health: 563, total: 1471 },
  { salary: 38200, labor: 955, health: 592, total: 1547 },
  { salary: 40100, labor: 1002, health: 622, total: 1624 },
  { salary: 42000, labor: 1050, health: 651, total: 1701 },
  { salary: 43900, labor: 1098, health: 681, total: 1779 },
  { salary: 45800, labor: 1145, health: 710, total: 1855 }, // 勞保最高級距
  { salary: 48200, labor: 1145, health: 748, total: 1893 },
  { salary: 50600, labor: 1145, health: 785, total: 1930 },
  { salary: 53000, labor: 1145, health: 822, total: 1967 },
  { salary: 55400, labor: 1145, health: 859, total: 2004 },
  { salary: 57800, labor: 1145, health: 896, total: 2041 },
  { salary: 60800, labor: 1145, health: 943, total: 2088 },
  { salary: 63800, labor: 1145, health: 990, total: 2135 },
  { salary: 66800, labor: 1145, health: 1036, total: 2181 },
  { salary: 69800, labor: 1145, health: 1083, total: 2228 },
  { salary: 72800, labor: 1145, health: 1129, total: 2274 },
  { salary: 76500, labor: 1145, health: 1187, total: 2332 },
  { salary: 80200, labor: 1145, health: 1244, total: 2389 },
  { salary: 83900, labor: 1145, health: 1301, total: 2446 },
  { salary: 87600, labor: 1145, health: 1359, total: 2504 },
  { salary: 92100, labor: 1145, health: 1428, total: 2573 },
  { salary: 96600, labor: 1145, health: 1498, total: 2643 },
  { salary: 101100, labor: 1145, health: 1568, total: 2713 },
  { salary: 105600, labor: 1145, health: 1638, total: 2783 },
  { salary: 110100, labor: 1145, health: 1708, total: 2853 },
  { salary: 115500, labor: 1145, health: 1791, total: 2936 },
  { salary: 120900, labor: 1145, health: 1875, total: 3020 },
  { salary: 126300, labor: 1145, health: 1959, total: 3104 },
  { salary: 131700, labor: 1145, health: 2043, total: 3188 },
  { salary: 137100, labor: 1145, health: 2126, total: 3271 },
  { salary: 142500, labor: 1145, health: 2210, total: 3355 },
  { salary: 147900, labor: 1145, health: 2294, total: 3439 },
  { salary: 150000, labor: 1145, health: 2327, total: 3472 },
  { salary: 156400, labor: 1145, health: 2426, total: 3571 },
  { salary: 162800, labor: 1145, health: 2525, total: 3670 },
  { salary: 169200, labor: 1145, health: 2624, total: 3769 },
  { salary: 175600, labor: 1145, health: 2724, total: 3869 },
  { salary: 182000, labor: 1145, health: 2823, total: 3968 },
  { salary: 189500, labor: 1145, health: 2939, total: 4084 },
  { salary: 197000, labor: 1145, health: 3055, total: 4200 },
  { salary: 204500, labor: 1145, health: 3172, total: 4317 },
  { salary: 212000, labor: 1145, health: 3288, total: 4433 },
  { salary: 219500, labor: 1145, health: 3404, total: 4549 },
  { salary: 228200, labor: 1145, health: 3539, total: 4684 },
  { salary: 236900, labor: 1145, health: 3674, total: 4819 },
  { salary: 245600, labor: 1145, health: 3809, total: 4954 },
  { salary: 254300, labor: 1145, health: 3944, total: 5089 },
  { salary: 263000, labor: 1145, health: 4079, total: 5224 },
  { salary: 273000, labor: 1145, health: 4234, total: 5379 },
  { salary: 283000, labor: 1145, health: 4389, total: 5534 },
  { salary: 293000, labor: 1145, health: 4544, total: 5689 },
  { salary: 303000, labor: 1145, health: 4700, total: 5845 },
  { salary: 313000, labor: 1145, health: 4855, total: 6000 },
];

/**
 * 取得指定帳面薪資的勞健保扣除額
 * @param {number} nominalSalary 帳面薪資
 * @returns {object} 包含該級距資訊的物件
 */
function getInsuranceDeduction(nominalSalary) {
  // 預設最低級距
  if (nominalSalary <= INSURANCE_BRACKETS[0].salary) {
    return INSURANCE_BRACKETS[0];
  }

  // 預設最高級距
  if (
    nominalSalary >= INSURANCE_BRACKETS[INSURANCE_BRACKETS.length - 1].salary
  ) {
    return INSURANCE_BRACKETS[INSURANCE_BRACKETS.length - 1];
  }

  // 尋找符合的級距 (大於等於 nominalSalary 的最小級距)
  for (let i = 0; i < INSURANCE_BRACKETS.length; i++) {
    if (INSURANCE_BRACKETS[i].salary >= nominalSalary) {
      return INSURANCE_BRACKETS[i];
    }
  }

  return INSURANCE_BRACKETS[INSURANCE_BRACKETS.length - 1];
}
