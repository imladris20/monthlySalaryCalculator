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
