import { useEffect, useState } from "react"

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        if (typeof window === 'undefined') return
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint)
        }
        
    
        handleResize()
        window.addEventListener('resize', handleResize)
        
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [breakpoint])
    
    return [isMobile]
}

export default useMobile