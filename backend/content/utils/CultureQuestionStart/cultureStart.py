"""
This utility builds starter culture files for a particular culture based on the questions for the default culture
Please modify the first four variables appropriately before running the utility
NOte that the backend setup data.sql must be modified to add these cultures

"""
import json
import os
import shutil

input_path = "H://GitHub//CulturalCSBytes//content//A000//A000//"  # location of question json
output_path = "H://NewUsers//everyday//Documents//CCSBWork//A002//"  # location of new culture json - must exist before running program
culture_code = "A002"
starter_message = "<p class=\"start_culture\">This question should be customized to appeal to Hispanic-Latinx high school students.  If you would like to contribute content, please contact <a href=\"mailto:lt@atcsed.org\">lt@atcsed.org</a></p>"


for json_file in os.listdir(input_path):
    if json_file.endswith(".json"):
  
        read_json_file = open(input_path + json_file, "r")
        json_data = json.load(read_json_file)
        
        write_filename = output_path + json_file[0:5] + culture_code + json_file[9:]
        new_culture_json_file =   open(write_filename, "w")
        print (write_filename)

        qstring = json_data["QuestionJSON"]["Question"]
        qstring = starter_message + qstring
        qstring = qstring.replace("A000-A000","A000-" + culture_code)  # replace image links
        json_data["QuestionJSON"]["Question"] = qstring

        qimg =  json_data["QuestionJSON"]["QuestionImage"]
        if qimg is None:
            print ("No image in" + json_file) 
        else:
            json_data["QuestionJSON"]["QuestionImage"] = qimg.replace("A000-A000","A000-" + culture_code)
      
        json_string = json.dumps(json_data,indent=4)
        new_culture_json_file.write (json_string)

        read_json_file.close()
        new_culture_json_file.close()

for image_file in os.listdir(input_path + "images//"):
    srcfile = input_path + "images//" + image_file
    tgtfile_name = image_file[0:5] + culture_code + image_file[9:]
    tgtfile = output_path + "images//" + tgtfile_name
    print (tgtfile)
    shutil.copyfile(srcfile, tgtfile)

