var farmbit_imgs = [];
{
  var ctx;
  var s = 10;
  var i = 0;
  //idle
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //shrug
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //walk- fat arms
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  i++

  //walk- fat legs
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //idle- water
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //shrug- water
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat arms- water
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat legs- water
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //idle- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //shrug- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //walk- fat arms- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  i++

  //walk- fat legs- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //idle- water- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //shrug- water- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat arms- water- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat legs- water- selected
  farmbit_imgs[i] = GenIcon(s,s);
  ctx = farmbit_imgs[i].context;
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++
}

var food_img;
{
  var ctx;
  var s = 10;
  food_img = GenIcon(s,s);
  ctx = food_img.context;
  ctx.fillStyle = yellow;
  ctx.fillRect(3,4,1,6); //stalk left
  ctx.fillRect(4,6,2,6); //stalk middle
  ctx.fillRect(6,4,1,6); //stalk right
  ctx.fillRect(2,2,3,3); //bulb left
  ctx.fillRect(3,4,4,3); //bulb middle
  ctx.fillRect(5,2,3,3); //bulb right
}

var poop_img;
{
  var ctx;
  var s = 10;
  poop_img = GenIcon(s,s);
  ctx = poop_img.context;
  ctx.fillStyle = brown;
  ctx.fillRect(2,8,6,2); //bottom
  ctx.fillRect(3,6,4,2); //middle
  ctx.fillRect(4,4,2,2); //top
  ctx.fillRect(2,2,1,3); //stink left
  ctx.fillRect(6,1,1,3); //stink right
}

