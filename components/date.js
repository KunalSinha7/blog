import { parseISO, format } from 'date-fns'

export default function Date({ dateString }) {
  console.log(dateString);
  const date = parseISO(dateString);
  console.log("date", date)
  return <time dateTime={dateString}>{format(date, 'p MMMM d, yyyy')}</time>
}