// eslint-disable-next-line react/prop-types
const ArrowIcon = ({ angle }) => {
  return (
    <svg
      height='512px'
      id='Layer_1'
      version='1.1'
      viewBox='0 0 512 512'
      width='512px'
      className='w-8 h-8 sm:block'
      xmlSpace='preserve'
      xmlns='http://www.w3.org/2000/svg'
    >
      <polygon
        points='396.6,160 416,180.7 256,352 96,180.7 115.3,160 256,310.5 '
        transform={`rotate(${angle || 0}, 256, 256)`}
      />
    </svg>
  );
};

export default ArrowIcon;
