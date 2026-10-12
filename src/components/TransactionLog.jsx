import EmptyState from './EmptyState';
import { TRANSACTION_LABELS } from '../utils/constants';
import { formatDate } from '../utils/seedData';

export default function TransactionLog({ transactions }) {
  if (transactions.length === 0) {
    return <EmptyState title="No transactions yet">Recorded stock changes will appear here.</EmptyState>;
  }

  return (
    <div className="table-wrap">
      <table className="table table--stack">
        <thead>
          <tr>
            <th>Date</th>
            <th>Book</th>
            <th>Type</th>
            <th className="num">Change</th>
            <th className="num">Stock after</th>
            <th>Member</th>
            <th>Recorded by</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const sign = t.type === 'borrow' ? '-' : '+';
            return (
              <tr key={t.id}>
                <td data-label="Date">{formatDate(t.date)}</td>
                <td data-label="Book" className="cell-title">{t.bookTitle}</td>
                <td data-label="Type"><span className={`tag tag--${t.type}`}>{TRANSACTION_LABELS[t.type]}</span></td>
                <td data-label="Change" className={`num change change--${sign === '-' ? 'down' : 'up'}`}>{sign}{t.quantity}</td>
                <td data-label="Stock after" className="num">{t.balanceAfter}</td>
                <td data-label="Member">{t.memberName ? `${t.memberName} (${t.memberId})` : '-'}</td>
                <td data-label="Recorded by">{t.performedBy}</td>
                <td data-label="Note">{t.note || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
