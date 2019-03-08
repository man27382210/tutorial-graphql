Not like page/offset base pagination, cursored base is friendly for real time message, to imagine a case like below:

![https://i.imgur.com/ZxeJk0n.png](https://i.imgur.com/ZxeJk0n.png)

With page/offset base, if someone remove post `id: 1` 1 sec before you change to next page, the posts you get for next offset is `id: 6 ~ id: 9`, but actually it should from `id: 5 ~ id: 8`, and also it needs time to caculation on DB side.

So now comes with cursored base to make sure every data we get for page is not change.
