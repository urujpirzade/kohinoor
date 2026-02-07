const UserCard = async ({ type, data }: { type: string; data: number }) => {
  return (
    <div className='card-mobile rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 md:p-6 flex-1 shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='flex flex-col items-center justify-center space-y-1 md:space-y-2'>
        <div className='font-semibold text-xs md:text-sm text-gray-800 uppercase tracking-wide text-center'>
          {type}
        </div>
        <div className='font-light text-2xl md:text-3xl text-gray-900'>
          {data}
        </div>
      </div>
    </div>
  );
};
export default UserCard;
