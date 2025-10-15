

![[Pasted image 20251015205719.png]]

Starting with reversing the main activity , got my attention the presence of the native function 
so i reversed the library with ghidra to see its logic 

![[Pasted image 20251015205933.png]]

It seems like this function just prints the "Hello from c++" message and nothing interesting going on here as it takes no parameters , so i guess i am moving to the next activity
But the shared preference and time storing seems it has something to do with the flag validation like it can be used as seed or whatever they are doing with it , we will see + another odd thing , The main activity never opens the second activity and it is exported 
but now lets analyze the next activity 

![[Pasted image 20251015211340.png]]

Definitely the flag validation is done here
![[Pasted image 20251015211433.png]]

i guess we have to hook this get flag function which will give a value seems to be interesting 
![[Pasted image 20251015211908.png]]
as this function is returning a value used to be compared to the value was set by the main activity and has to be matching
but we can use frida for sure to bypass this checks 
![[Pasted image 20251015212215.png]]

since we already understand the required conditions to call the get flag 
we can simply utilize FRIDA to get these values and then pass them to the activity to get the flag for us
so we need to set the shared preference  value from the main activity that the cd() function will validate , we don't need to get its value 

![[Pasted image 20251015213559.png]]

and now we can move on to the next conditions to be met 
the activity validate the base64 secret then call the native get flag function 
easy to tell what needed just a deep link triggering intent can be sent using adb command or developed app
but what exactly the deep link ?
easy -> it is just base64 encoded encrypted secret key 
![[Pasted image 20251015214158.png]]
with all needed input for AES algorithm to work we can generate the secret encrypted key to call the function and get the flag 
![[Pasted image 20251015214247.png]]

So let's do it : 
![[Pasted image 20251015214435.png]]

![[Pasted image 20251015214517.png]]
ok it printed success but doesn't seem to leak the flag in the logs or anywhere
![[Pasted image 20251015214732.png]]
So i guess we have to scan the memory to find the flag ourselves 
![[Pasted image 20251015215009.png]]
as the function seems to be building the flag but then directly returns success it doesn't return the flag
so we can scan the memory with the hex format of the beginning of the flag  like stated in the description of the challenge 
![[Pasted image 20251015215227.png]]

```
Java.perform(function() {
    console.log("[+] Scanning for MHL{ pattern in memory...");
    
    Process.enumerateRanges('r--').forEach(function(range) {
        if (range.size < 0x1000000) { // Reasonable size
            Memory.scan(range.base, range.size, "4D 48 4C 7B", { // MHL{ in hex
                onMatch: function(address, size) {
                    console.log('[+] Pattern found at: ' + address);
                    try {
                        // Read potential flag string
                        var flag = address.readCString();
                        if (flag && flag.includes('}')) {
                            console.log('[FOUND FLAG] ' + flag);
                            send(flag);
                        }
                    } catch(e) {
                        console.log('[!] Error reading string: ' + e);
                    }
                },
                onError: function(reason) {
                    // console.log('[!] Scan error: ' + reason);
                },
                onComplete: function() {
                    // console.log('[+] Scan completed for range: ' + range.base);
                }
            });
        }
    });
});
```

![[Pasted image 20251015215403.png]]