import Loader from '@/components/Loader/Loader';

export default function loading() {
  return(
  <>
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center ">
         <img 
        src="/img/loading/loading.gif" 
        alt="loading gif" 
        className='w-100 h-60' 
        />
      </div>
    </div>  
  </>
  )
  ;
}
