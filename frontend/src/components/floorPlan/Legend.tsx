export default function Legend() {
    return (
        <div className="flex gap-6 mb-4 text-sm">

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                Available
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                Occupied
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                Recommended
            </div>

        </div>
    );
}