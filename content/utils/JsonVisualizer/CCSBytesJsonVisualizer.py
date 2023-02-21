"""
Question Visualizer:

This Python script will loop through all of the Question json in a particular folder and create html from the json
that allows for seeing if tagging of the questions including embedded html is correct.
The html files will be written to the same folder as this Python program and the file "ccsbcss.css"
Your may want to update ccsbcss.css to get the desired look and feel of all the elements
Please also copy all of the images necessary to display the questions to an "image" folder under the folder where
the *.html files will live

"""


import json
import os

def writeHTML(json_data, html_file, html_filename):

    meta_name = html_filename.replace(".html","")

    html_file.write("<!DOCTYPE html>\n") 
    html_file.write("<html>\n")
    html_file.write("<head>\n")
    html_file.write("    <title>" + meta_name + "</title>\n")
    html_file.write('    <link rel="stylesheet" href="ccsbcss.css">\n')
    html_file.write("</head>\n")
    html_file.write("<body>\n")
    
    html_file.write("<h1>Test output for " + meta_name + "</h1>\n")
   
    html_file.write("<h2>Metadata</h2>\n")
    html_file.write("__comment__: " + json_data["__comment__"] + "<br>\n")
    html_file.write("__copyright__: " + json_data["__copyright__"] + "<br>\n")
    html_file.write("QuestionSetCode: " + json_data["QuestionSetCode"] + "<br>\n")
    html_file.write("CultureCode: " + json_data["CultureCode"] + "<br>\n")        
    html_file.write("MQCode: " + json_data["MQCode"] + "<br>\n")
    html_file.write("QuestionAltCode: " + str(json_data["QuestionAltCode"]) + "<br>\n")
    html_file.write("QuestionDifficulty: " + str(json_data["QuestionDifficulty"]) + "<br>\n")

    qjson = json_data["QuestionJSON"]

    html_file.write("<h2>Question</h2>\n")
    html_file.write(qjson["Question"])
    html_file.write("<p></p>" + "\n")

    html_file.write("<h2>Answers</h2>\n")
    html_file.write("<table><tr><td>&nbsp;&nbsp;A&nbsp;&nbsp;</td><td>" + qjson["Answer1"] + "</td></tr><tr><td>&nbsp;&nbsp;B&nbsp;&nbsp;</td><td>" + qjson["Answer2"] + "</td></tr><tr><td>&nbsp;&nbsp;C&nbsp;&nbsp;</td><td>" + qjson["Answer3"] + "</td></tr><tr><td>&nbsp;&nbsp;D&nbsp;&nbsp;</td><td>" + qjson["Answer4"] + "</td></tr></table>")
    html_file.write("<p></p>\n")
    html_file.write("CorrectAnswer: " + str(qjson["CorrectAnswer"]) + "<br>\n")
    html_file.write("FixedOrderFromBottom: " + str(qjson["FixedOrderFromBottom"]) + "<br>\n")
    html_file.write("<p></p>")

    html_file.write("<h2>Explanation</h2>")
    html_file.write(qjson["Explanation"])
    html_file.write("<p></p>")
 
    html_file.write("</body>\n")
    html_file.write("</html>\n")

#main code begins here

# Read CSS
#css_file = open("ccsbcss.css")
#css_contents = css_file.read()

#input_path = input(r"Enter the path of the folder: ")
input_path = "H://GitHub//CulturalCSBytes//content//A000//A000//"  # location of question json

for json_file in os.listdir(input_path):
    if json_file.endswith(".json"):
  
        open_json_file = open(input_path + json_file, "r")
        json_data = json.load(open_json_file)
        html_filename = json_file.replace(".json",".html")
        html_file =  open(html_filename, "w")
        print(html_filename)

        writeHTML(json_data, html_file, html_filename)

        open_json_file.close()
        html_file.close()










