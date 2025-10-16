fetch("/api/user/name").then(async res => {
    console.log(await res.text());
});