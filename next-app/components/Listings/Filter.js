import { useState } from 'react';

const FilterModal = ({ isOpen, onClose, onApply }) => {
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);

    if (!isOpen) return null;

    const handleApply = () => {
        onApply({ price, area, isAvailable });
        onClose();
    };

    return (
        // <div className={styles.wrapper}>
        //     <div className={styles.formWrapper}>
        //         <label className={styles.formInputContainer}>
        //             <span className={styles.inputLabel}>Name</span>
        //             <input
        //                 onChange={event => setName(event.target.value)}
        //                 value={name}
        //                 className={styles.input}
        //             />
        //         </label>

        //         <label className={styles.formInputContainer}>
        //             <span className={styles.inputLabel}>Address</span>
        //             <input
        //                 onChange={event => setPropertyAddress(event.target.value)}
        //                 value={propertyAddress}
        //                 className={styles.input}
        //             />
        //         </label>

        //         <label className={styles.formInputContainer}>
        //             <span className={styles.inputLabel}>Description</span>
        //             <input
        //                 onChange={event => setDescription(event.target.value)}
        //                 value={description}
        //                 className={styles.input}
        //             />
        //         </label>

        //         <div>
        //             <button onClick={handleUploadPropertyImage}>Upload new Image</button>
        //         </div>

        //         <label className={styles.formInputContainer}>
        //             <span className={styles.inputLabel}>Price per Day</span>
        //             <input
        //                 onChange={event => setPricePerDay(event.target.value)}
        //                 value={pricePerDay}
        //                 className={styles.input}
        //             />
        //         </label>
        //     </div>

        //     <div className='mt-4 flex justify-end'>
        //         <button
        //             onClick={onCreate}
        //             disabled={
        //                 !name || !propertyAddress || !description || !imgURL || !pricePerDay
        //             }
        //             type='button'
        //             className='border rounded-lg px-4 py-2 text-sm font-medium'
        //         >
        //             Create
        //         </button>
        //     </div>
        // </div>


        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Filter Options</h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Area:</label>
                    <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Is Available:</label>
                    <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="mt-1"
                    />
                </div>
                <button
                    onClick={handleApply}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default FilterModal;