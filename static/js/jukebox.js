const options = {
    keys: [
        "path"
    ]
};

const fuse = new Fuse(library, options);

function search() {
    pattern = document.getElementById("searchInput").value;
    if (pattern == "") {
        document.getElementById("library").style.display = "";
        document.getElementById("results").innerHTML = "";
    } else {
        document.getElementById("library").style.display = "none";
        results = fuse.search(pattern);
        resultString = "<ul>";
        for (var i=0;i<results.length; ++i) {
            song = results[i].item;
            resultString += '<li id="' + song.id + '" class="song" onclick="add(this.dataset.songindex)" data-songindex="' + song.index + '">';
            resultString += '<span class="name">' + song.name + '</span><br/>';
            resultString += '<span class="path">' + song.path + '</span>';
            resultString += '</li>';
        }
        pattern = document.getElementById("results").innerHTML = resultString;
    }
}

function handler() {
    if(this.status == 200) {
        alert(this.responseText);
    } else {
        alert("Something went wrong :(");
    }
}
function add(songId) {
    path = library[songId].path;
    var oReq = new XMLHttpRequest();
    oReq.onload = handler;
    oReq.open("POST", "add");
    oReq.send(path);
}
