let photoArray=[];
const imagecontainer=document.getElementById('imgcontainer');
const loader = document.getElementById('loader');
const count=30;
let ready=false;
let imgloded=0;
let totalimg=0;
const apikey='x1U7T5ZeBj7jJS2Q9i1ffhZ90fhPNJLzrQBOT3Sxc_Y';
const api = `https://api.unsplash.com/photos/random/?client_id=${apikey}&count=${count}`;
function imageloded(){
    console.log("imageloaded");
    imgloded++;
    if(imgloded==totalimg){
        ready=true;
        loader.hidden=true;
        console.log(ready);
    }
}
function displayPhoto(){
    totalimg=photoArray.length;
    photoArray.forEach((photo)=>{
        const item= document.createElement('a');
        item.setAttribute('href',photo.links.html)
        item.setAttribute('target','_blank')
        const img= document.createElement('img');
        img.addEventListener('load',imageloded)
        img.setAttribute('src',photo.urls.regular)
        img.setAttribute('alt',photo.alt_description);
        img.setAttribute('title',photo.alt_description);
        item.appendChild(img)
        imagecontainer.appendChild(item);
    })

}
async function getPhoto(){
    try{
const responce= await fetch(api);
    photoArray= await responce.json();
    console.log(photoArray);
    displayPhoto()
    }
    catch(error){
        console.log("error"+error);
    }
}
window.addEventListener('scroll',()=>{
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight-1000 && ready){
        ready=false;
        getPhoto();
        console.log("loaded");
    }
})
getPhoto()