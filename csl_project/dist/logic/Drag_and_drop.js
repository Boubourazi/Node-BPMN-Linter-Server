"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Drag_and_drop = (area) => {
    const file_reader = new FileReader();
    file_reader.onerror = (error) => {
        window.alert("'file_reader.onerror': " + error.type);
    };
    const result = new Promise((compute_XML) => {
        file_reader.onload = (event) => {
            window.console.assert(event.target === file_reader, "'event.target === file_reader', untrue?");
            compute_XML(file_reader.result);
        };
    });
    // FYI: 'drag', 'dragend' and 'dragstart' are *NEVER* fired when dragged entities come from the OS (compared to draggable entities in the browser having "draggable = true")
    // Corollary: 'setDragImage' won't work here...
    // Mouse events are inhibited when Drag & drop: http://blog.teamtreehouse.com/implementing-native-drag-and-drop
    area.addEventListener("dragenter", (event) => {
        event.preventDefault();
        event.stopPropagation();
    }, true);
    // 'preventDefault' in 'dragover' is MANDATORY to later allow 'drop':
    area.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
    }, true);
    area.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        // Caution: 'event.dataTransfer.types.length === 2' with Firefox while 'event.dataTransfer.types.length === 1' with Chrome
        // 'event.dataTransfer.types.length === 7' with Safari!
        // The following code works well for Chrome and Firefox while it has no effect for Safari:
        if (event.dataTransfer.items) { // 'undefined' for Safari!
            let i = 0;
            while (event.dataTransfer.items[i].kind !== "file")
                i++;
            // Dropped file name:
            // window.alert(event.dataTransfer.items[i].getAsFile().name);
            // Load XML:
            file_reader.readAsText(event.dataTransfer.items[i].getAsFile()); // UTF-8
        }
    }, true);
    return result;
};
exports.default = Drag_and_drop;
//# sourceMappingURL=Drag_and_drop.js.map