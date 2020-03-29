
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
export function FormatDate(val,num='d/m/y')
{
    console.log(typeof(val),num)
    const date=new Date(val)

    switch (num) {
        case 'd/m/y':
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
          case 'd-m-y':
          return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
          case 'd M y':
          return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
        default:
            return 'undefined'
    }
}
export const calculatevat = (amount, vat ,meter_charge, precision) => {
  console.log(amount, meter_charge,vat, precision)
  if (!isNaN(amount) && !isNaN(vat) && !isNaN(precision)) {
    return Math.ceil(parseFloat(((parseFloat(amount) - parseFloat(meter_charge)) * (parseFloat(vat) * (1 / (100 + parseFloat(vat))))).toFixed(precision)))
  }
  return '';
}


export const calculaterev = (amount, revth, revval, precision) => {
  if (!isNaN(amount) && !isNaN(revth) && !isNaN(revval) && !isNaN(precision)) {
    return parseFloat((parseFloat(amount) >= parseFloat(revth) ? parseFloat(revval).toFixed(precision) : 0))
  }
  return '';
}