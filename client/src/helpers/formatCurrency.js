export const formatCurrency = (money) => {
    money = money.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(money)) money = money.replace(pattern, "$1,$2");
    return money;
}