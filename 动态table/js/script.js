const table = document.getElementById("table");
const fileUploader = document.querySelector("#myfiles");

fileUploader.setAttribute("hidden", true);

const search = () => {
    const filter = myInput.value.toLowerCase();
    const rows = table.querySelectorAll("tr");
    rows.forEach(row => {
        const nested = row.querySelectorAll("td");
        const [columnA, columnB] = (nested.length === 2) ? [nested[0].textContent, nested[1].textContent] : ["", ""];
								// set search column
        const result = columnA.toLowerCase();
        row.style.display = (result.indexOf(filter) > -1) ? "" : "none";
    });
}

const checkTable = () => {
    const el = document.querySelector("[data-toggle]");
    if (el.hasAttribute("data-active")) {
        el.textContent = "";
        const fragment = document.getElementById("table-reset");
        const instance = document.importNode(fragment.content, true);
        el.appendChild(instance);
    } else el.setAttribute("data-active", true);
}

const pullfiles = function() {
    const fileInput = fileUploader;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(evt) {
        handleJSON(evt.target.result);
    };
    reader.readAsText(file);
}

function handleJSON(objectArray) {
    checkTable();
    const abbr_enabled = false;
    const sections = JSON.parse(objectArray);
    const fragment = document.getElementById("table-row-template");
    sections.forEach(section => {
        section.items.forEach(item => {
            const instance = document.importNode(fragment.content, true);
            if (item === section.items[0])
                instance.querySelector(".name").classList = "name lead";
            // enable html abbreviation tags
            if (abbr_enabled) {
                instance.querySelector(".abbr").textContent = item.name;
                instance.querySelector(".abbr").title = item.desc;
            } else
                instance.querySelector(".name").textContent = item.name;
            instance.querySelector(".desc").textContent = item.desc;
            table.appendChild(instance);
        });
    });
}

fileUploader.onchange = pullfiles;



/* JSON TEMPLATE
[{
	"name": "section-name",
	"items": [{
		"name": "item-name",
		"desc": "description"
	}]
}]
*/



/* DEFAULT TABLE DATA - (The majority of this data was sourced from https://en.wikipedia.org/w/index.php?title=List_of_computing_and_IT_abbreviations&oldid=907152883) */
handleJSON(`[{"name":"0–9","items":[{"name":"1GL","desc":"First-Generation Programming Language"},{"name":"1NF","desc":"First Normal Form"},{"name":"10B2","desc":"10BASE-2"},{"name":"10B5","desc":"10BASE-5"},{"name":"10B-F","desc":"10BASE-F"},{"name":"10B-FB","desc":"10BASE-FB"},{"name":"10B-FL","desc":"10BASE-FL"},{"name":"10B-FP","desc":"10BASE-FP"},{"name":"10B-T","desc":"10BASE-T"},{"name":"100B-FX","desc":"100BASE-FX"},{"name":"100B-T","desc":"100BASE-T"},{"name":"100B-TX","desc":"100BASE-TX"},{"name":"100BVG","desc":"100BASE-VG"},{"name":"286","desc":"Intel 80286 processor"},{"name":"2B1Q","desc":"2 Binary 1 Quaternary"},{"name":"2FA","desc":"Two-factor authentication"},{"name":"2GL","desc":"Second-Generation Programming Language"},{"name":"2NF","desc":"Second Normal Form"},{"name":"3GL","desc":"Third-Generation Programming Language"},{"name":"3GPP","desc":"3rd Generation Partnership Project - 3G comms"},{"name":"3GPP2","desc":"3rd Generation Partnership Project 2"},{"name":"3NF","desc":"Third Normal Form"},{"name":"386","desc":"Intel 80386 processor"},{"name":"486","desc":"Intel 80486 processor"},{"name":"4B5BLF","desc":"4 Byte 5 Byte Local Fiber"},{"name":"4GL","desc":"Fourth-Generation Programming Language"},{"name":"4NF","desc":"Fourth Normal Form"},{"name":"5GL","desc":"Fifth-Generation Programming Language"},{"name":"5NF","desc":"Fifth Normal Form"},{"name":"6NF","desc":"Sixth Normal Form"}]}]`);