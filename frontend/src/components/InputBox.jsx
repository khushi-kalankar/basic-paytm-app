

export function InputBox({label, placeholder, onChange}){
    return <div>
        <div className="text-left text-sm font-medium py-1.5 pl-1">
            {label}
        </div>
        <input onChange={onChange} type="text" placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
}