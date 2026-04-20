const fs = require('fs');
const filepath = 'c:/Users/suraj/Documents/SEM6Cp/glvms/src/pages/Dashboard.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const regex = /<button\s*className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary shadow-soft hover:bg-primary hover:text-white transition-all duration-500"\s*onClick=\{\(\) => notifyAssignee\(lecture\)\}\s*title="WhatsApp Notify"\s*>\s*<MessageSquare size=\{16\} \/>\s*<\/button>/g;

const replacement = `<div className="flex items-center gap-3">
                          <button 
                            className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-danger shadow-soft hover:bg-danger hover:text-white transition-all duration-500"
                            onClick={(e) => { e.stopPropagation(); handleDeleteLecture(lecture.id); }}
                            title="Mark Checklist Done / Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary shadow-soft hover:bg-primary hover:text-white transition-all duration-500"
                            onClick={(e) => { e.stopPropagation(); notifyAssignee(lecture); }}
                            title="WhatsApp Notify"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log("SUCCESS");
} else {
  console.log("FAILED");
}
