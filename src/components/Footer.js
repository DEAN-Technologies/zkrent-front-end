import { GlobeAmericasIcon } from '@heroicons/react/24/solid'
import useMessages from '../hooks/useMessages'

function Footer() {
  const messages = useMessages().footer

  return (
    <div className='flex justify-between items-center px-20 py-3 border border-t-[#DDDDDD] fixed bottom-0 left-0 right-0 bg-white'>
      <div className='flex items-center space-x-6'>
        <p className='text-sm font-light'>{messages.copyright}</p>
        <p className='text-sm font-light'>{messages.privacy}</p>
        <p className='text-sm font-light'>{messages.terms}</p>
        <p className='text-sm font-light'>{messages.sitemap}</p>
        <p className='text-sm font-light'>{messages.destinations}</p>
      </div>

      <div className='flex items-center space-x-6'>
        <div className='flex items-center space-x-2'>
          <GlobeAmericasIcon className='h-5 w-5 transition-all duration-300 text-gray-800' />
          <p className='text-sm font-light'>{messages.language}</p>
        </div>
        <div className='flex space-x-2'>
          <p className='text-sm font-light'>{messages.currency}</p>
        </div>
        <div>
          <p className='text-sm font-light'>{messages.support}</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
