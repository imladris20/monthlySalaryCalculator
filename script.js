document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculator-form');
    const resultSection = document.getElementById('result-section');
    const hourlyWageEl = document.getElementById('hourly-wage');
    const overtimePayEl = document.getElementById('overtime-pay');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const salary = parseFloat(document.getElementById('monthly-salary').value);
        const hours = parseFloat(document.getElementById('overtime-hours').value);
        const type = document.getElementById('overtime-type').value;

        if (isNaN(salary) || isNaN(hours)) return;

        // 計算平日每小時工資 (月薪 / 240)
        const hourlyWage = salary / 240;
        
        let overtimePay = 0;

        // 依據台灣勞基法加班費計算標準 (簡化版)
        if (type === 'normal') {
            // 平日延長工時
            // 前 2 小時：時薪 * 4/3
            // 後 2 小時：時薪 * 5/3
            if (hours <= 2) {
                overtimePay = hours * hourlyWage * (4 / 3);
            } else {
                overtimePay = (2 * hourlyWage * (4 / 3)) + ((hours - 2) * hourlyWage * (5 / 3));
            }
        } else if (type === 'rest') {
            // 休息日加班
            // 前 2 小時：時薪 * 4/3
            // 第 3~8 小時：時薪 * 5/3
            // 第 9~12 小時：時薪 * 8/3
            if (hours <= 2) {
                overtimePay = hours * hourlyWage * (4 / 3);
            } else if (hours <= 8) {
                overtimePay = (2 * hourlyWage * (4 / 3)) + ((hours - 2) * hourlyWage * (5 / 3));
            } else {
                overtimePay = (2 * hourlyWage * (4 / 3)) + (6 * hourlyWage * (5 / 3)) + ((hours - 8) * hourlyWage * (8 / 3));
            }
        } else if (type === 'holiday') {
            // 國定假日 / 例假日 加班
            // 8 小時內皆給予一日工資 (時薪 * 8)
            // 備註：此為額外加給的部分
            if (hours <= 8) {
                overtimePay = hourlyWage * 8;
            } else {
                // 超過 8 小時的部分，比照平日加班費率計算
                let extraHours = hours - 8;
                let extraPay = 0;
                if (extraHours <= 2) {
                    extraPay = extraHours * hourlyWage * (4 / 3);
                } else {
                    extraPay = (2 * hourlyWage * (4 / 3)) + ((extraHours - 2) * hourlyWage * (5 / 3));
                }
                overtimePay = (hourlyWage * 8) + extraPay;
            }
        }

        // 顯示結果，取整數
        hourlyWageEl.textContent = `NT$ ${Math.round(hourlyWage)}`;
        overtimePayEl.textContent = `NT$ ${Math.round(overtimePay).toLocaleString()}`;
        
        // 顯示結果區塊
        resultSection.classList.remove('hidden');
        
        // 重新觸發淡入動畫
        resultSection.classList.remove('animate-fade-in');
        void resultSection.offsetWidth; // 觸發重繪 (reflow)
        resultSection.classList.add('animate-fade-in');
    });
});
