// eslint-disable-next-line react/prop-types
const Cell = ({ isActive = false, day, onCheck, color }) => {
  if (isActive) {
    return (
      <div
        className='cursor-pointer hover:border hover:brightness-50'
        style={{ backgroundColor: color }}
        onClick={() => onCheck(day)}
      ></div>
    );
  } else {
    return <div className='bg-slate-300'></div>;
  }
};

export default Cell;
