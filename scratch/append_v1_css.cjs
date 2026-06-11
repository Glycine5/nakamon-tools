const fs = require('fs');

const cssAdditions = `
/* =========================================
   V1 Compatibility / Mapping to DQ Style
   ========================================= */

.glass-panel, .result-panel {
  background-color: var(--bg-color);
  border: 3px solid var(--border-color);
  border-radius: 10px;
  padding: 16px;
  position: relative;
  box-shadow: 0 0 0 2px var(--bg-color), 0 0 0 5px var(--border-color);
  margin: 8px 4px;
  color: var(--text-color);
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.collapsible-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px dashed #555;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.collapsible-header h3 {
  margin: 0;
  border: none;
  font-size: 1.1rem;
  color: var(--accent-color) !important;
}

select, input[type="text"], input[type="number"] {
  background: var(--bg-color);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  padding: 6px 10px;
  font-family: 'DotGothic16', monospace;
  font-size: 1rem;
  border-radius: 4px;
}

select:focus, input:focus {
  outline: none;
  border-color: var(--accent-color);
}

/* Fix specific inline colors from V1 to look okay on black */
* {
  --text-primary: #ffffff !important;
  --text-secondary: #dddddd !important;
  --text-muted: #aaaaaa !important;
  --bg-primary: #000000 !important;
  --bg-secondary: #111111 !important;
  --border-color: #ffffff !important;
  --accent-blue: #3498db !important;
  --accent-gold: #f1c40f !important;
  --accent-red: #e74c3c !important;
}

button {
  font-family: 'DotGothic16', monospace;
}

.step-family-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.step-family-option input[type="radio"] {
  display: none;
}

.step-family-option span {
  border: 2px solid var(--border-color);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  background: var(--bg-color);
}

.step-family-option input:checked + span {
  background: var(--text-color);
  color: var(--bg-color);
}
`;

let css = fs.readFileSync('v2/src/index.css', 'utf8');
if (!css.includes('V1 Compatibility')) {
  fs.writeFileSync('v2/src/index.css', css + '\n' + cssAdditions, 'utf8');
}
console.log('Appended V1 CSS mappings.');
