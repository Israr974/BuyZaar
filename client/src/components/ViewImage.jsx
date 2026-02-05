import React from 'react'
import { ImCross } from 'react-icons/im';

const ViewImage = ({ url,close}) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="relative w-full max-w-md h-[70vh] bg-white flex justify-center items-center">
                
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >
                    <ImCross onClick={close} />
                </button>

                <img
                    src={url}
                    alt="full screen"
                    className="max-h-full max-w-full object-contain"
                />
            </div>
        </div>
    )
}

export default ViewImage
