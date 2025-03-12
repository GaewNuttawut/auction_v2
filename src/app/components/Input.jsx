const Input = ({ label, type, name, value, onChange, required, min }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange} 
      min={min} 
      required={required} 
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
    />
  </div>
);

export default Input;