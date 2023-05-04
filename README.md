# React_Quizlet_Copy

## Description
This is a react web app which is a little replica of the quizlet site. You can add your own words to the application and then study them by typing in the translation. The application is specifically made for german and english. 

## Functions
You can not only input a list of your own words in a UI, but you can import a JSON file with words and the translation. The following is the structure of the json file:
```
{
  "english": [
    "word1",
    "word2"
  ],
  "german": [
    "word1",
    "word2"
  ]
}
```
Also, you can export a Set of words, or export all added sets of words. Additionally, you can randomize the order in which you learn the words, reset the State, select different word sets and delete word sets. 
Everything is stored in `localStorage`, so if you delete your browser cookies and you didn't export your sets... they're gone. It is planned to add migrate the storage to a database though.
