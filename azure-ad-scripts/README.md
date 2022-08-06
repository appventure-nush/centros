### Running Scripts
By default, running powershell scripts is disabled
on Windows for security purposes.

We need to change the execution policy.

```
set-executionpolicy remotesigned -Scope Process 
```

This will temporarily enable execution of unsigned ps scripts
for the current terminal sessionStore.

It is not recommended to disable it globally as it may result in
a security risk.


*Or alternatively, just copy paste the script*
