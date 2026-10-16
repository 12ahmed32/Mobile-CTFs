// ===== Configuration =====
var moduleName = "libFridaEight.so";
var functionName = "Java_com_mobilehackinglab_FridaEight_MainActivity_strCmp";

function waitForModule(modName, callback) {
    var mod = Process.findModuleByName(modName);
    if (mod !== null) {
        callback(mod);
        return;
    }
    setTimeout(function () {
        waitForModule(modName, callback);
    }, 50);
}

waitForModule(moduleName, function (mod) {
    console.log("[+] " + moduleName + " loaded @ " + mod.base);

    var targetFuncAddr = mod.findExportByName(functionName);
    console.log("[*] Target function " + functionName + " @ " + targetFuncAddr);

    var libc = Process.findModuleByName("libc.so");
    var strcmpAddr = libc.findExportByName("strcmp");
    console.log("[*] strcmp @ " + strcmpAddr);

    Interceptor.attach(strcmpAddr, {
        onEnter: function (args) {
            var callerAddr = this.returnAddress;
            var offset = callerAddr.sub(targetFuncAddr).toInt32();

            if (offset >= 0 && offset < 0x120) {
                var a = args[0].readCString();
                var b = args[1].readCString();
                console.log("[*] strcmp() inside strCmp — arg1: " + a + " | arg2: " + b);
            }
        }
    });
});