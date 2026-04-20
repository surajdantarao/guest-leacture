const fs = require('fs');
const filepath = 'c:/Users/suraj/Documents/SEM6Cp/glvms/src/pages/Dashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const PREDEFINED_ITEMS = [ "Projector Setup", "Microphone Check", "Speaker Confirmation", "Presentation Ready", "Guest Welcome Kit", "Attendance Sheet", "Certificate Preparation", "Refreshments Arranged", "Hall Cleanliness", "Seating Arrangement", "Banner/Poster Setup", "Technical Support Ready", "Recording Setup", "Internet Connection Check", "Backup Power Check" ];

const replacementComponent = `const AddItemInput = ({ onAdd, existingItems = [] }) => {
  const [val, setVal] = useState('');
  
  const existingNames = existingItems && Array.isArray(existingItems) ? existingItems.map(i => i.item_name?.toLowerCase()) : [];

  const handleAdd = () => {
    if (val.trim()) {
      onAdd(val);
      setVal('');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standard Protocols</p>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_ITEMS.map((item) => {
             const isSelected = existingNames.includes(item.toLowerCase());
             return (
               <button
                 key={item}
                 type="button"
                 onClick={() => { if(!isSelected) onAdd(item); }}
                 disabled={isSelected}
                 className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 \${
                   isSelected 
                   ? 'bg-success/5 text-success border-success/20 opacity-60 cursor-not-allowed' 
                   : 'bg-white border-gray-200 text-secondary hover:border-primary/40 hover:text-primary shadow-sm active:scale-95'
                 }\`}
               >
                 {isSelected ? <CheckSquare size={14} /> : <div className="h-3 w-3 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 rounded-sm"></div>}
                 {item}
               </button>
             );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Custom Requirement</p>
        <div className="flex flex-col gap-4">
          <div className="relative group">
             <input
                type="text"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Add institutional requirement..."
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-primary/20 focus:bg-white rounded-2xl px-6 h-14 text-sm font-bold outline-none transition-all placeholder:text-gray-300 shadow-inner"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30">
                <ShieldCheck size={14} />
                <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
             </div>
          </div>
          <Button
            onClick={handleAdd}
            className="w-full h-14 text-[10px] font-black uppercase tracking-widest rounded-2xl"
          >
            <Plus size={18} className="mr-3" /> Execute Addition
          </Button>
        </div>
      </div>
    </div>
  );
};`;

const startTarget = 'const AddItemInput = ({ onAdd';
const endTarget = 'export default Dashboard;';
const startIndex = content.indexOf(startTarget);
const endIndex = content.indexOf(endTarget);

if (startIndex > -1 && endIndex > -1) {
  content = content.substring(0, startIndex) + replacementComponent + "\n\n" + content.substring(endIndex);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log("SUCCESS");
} else {
  console.log("FAILED");
}
