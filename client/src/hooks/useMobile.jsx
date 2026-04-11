import { useEffect, useState } from "react"

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        // Check if window is defined (for SSR)
        if (typeof window === 'undefined') return
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint)
        }
        
        // Initial check
        handleResize()
        
        // Add event listener
        window.addEventListener('resize', handleResize)
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [breakpoint])
    
    return [isMobile]
}

export default useMobile