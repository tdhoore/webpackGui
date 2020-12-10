const PHPServer = require('php-server-manager');
const { spawn } = require('child_process');
const { dialog } = require('electron').remote;

let pathToSrc = null;

//init 
const init = () => { 
    //start php server
    PHPServer.start({
        port: 80
    });

    dirElem.addEventListener("click", handleChangeDir);
}

const runCommand = async (command = "", dir = "", func = () => { }) => {
  const ls = await spawn('npm', [command], {cwd: dir, shell: true});

  ls.stdin.end(`cd "${dir}" && ${command}`);

  ls.on('error', function (err) { throw err });
  
  ls.stdout.on("data", stdout => { 
    console.log(stdout.toString());
  });

  ls.stderr.on("data", stderr => { 
    console.log(stderr.toString());
  });

  return ls.stderr.on("close", code => { 
    //is done

    func();
  });
}

//get directory
const dirElem = document.querySelector(".selectDir");

const RemoveLastDirectoryPartOf = the_url => {
    var the_arr = the_url.split(`\\`);
    the_arr.pop();
    return (the_arr.join('/'));
};

const installDone = () => { 
  console.log("gufhdkgdfijg");
}

const handleChangeDir = e => {
  //const path = RemoveLastDirectoryPartOf(e.currentTarget.files[0].path);

  dialog.showOpenDialog({
    buttonLabel: "select working dirictory",
    properties: ['openDirectory']
  }).then(result => {
    if (result.filePaths[0]) { 
      //run install
      pathToSrc = result.filePaths[0] + "/src_DELETE_IN_PROD/";
      runCommand("install", pathToSrc, installDone);
    }
  })
};

init();