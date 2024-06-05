from flask import Flask,jsonify,request,send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from datetime import datetime
import sqlite3
import os

import json

from resumeOps import getrank

from resumeOps import parseresume

from myMailer import mailto
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config["JWT_SECRET_KEY"] = "supersecretkey" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/register/candidate', methods=['POST'])
def register():
    try:
        data = request.get_json()
        role = 'candidate' 
        name = data['name']
        email = data['email']
        password = data['password']
        phone = data['phone']
        qualification = data['qualification']
        conn = sqlite3.connect('mydatabase.db')
        cursor = conn.cursor()

        cursor.execute("INSERT INTO user (email, password, role) VALUES (?, ?, ?)",
                       (email, password, role))
        conn.commit()
        user_id = cursor.lastrowid
        cursor.execute("INSERT INTO candidate (user_id, name, phone, qualification) VALUES (?, ?, ?, ?)",
                       (user_id, name, phone, qualification))
        conn.commit()

        conn.close()
        return jsonify({"message": "Registration successful"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/register/hr', methods=['POST'])
def register_hr():
    try:
        data = request.get_json()
        role = 'hr'
        company_name = data['company_name']
        email = data['email']
        password = data['password']
        company_description = data['company_description']

        conn = sqlite3.connect('mydatabase.db')
        cursor = conn.cursor()

        cursor.execute("INSERT INTO user (email, password, role) VALUES (?, ?, ?)",
                       (email, password, role))
        conn.commit()

        user_id = cursor.lastrowid

        cursor.execute("INSERT INTO hr (user_id, company_name, about) VALUES (?, ?, ?)",
                       (user_id, company_name, company_description))
        conn.commit()
        conn.close()

        return jsonify({"message": "HR registration successful"})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['uemail']
    password = data['pass']
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute("select * FROM user where email = ? and password=?", (email,password))
    user_data = cursor.fetchone()
    conn.close()

    if user_data:
        access_token = create_access_token(identity={"user_id": user_data[0], "role": user_data[3]})
        return jsonify({"token": access_token,"role": user_data[3]})
    
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/candidate/profile', methods=['POST'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()

    user_id = current_user.get("user_id")

    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute("select * FROM hr where user_id = ?", (user_id,))
    user_data = cursor.fetchone()
    conn.close()
    print(user_data)
    print(user_id)
    if user_data:
        return jsonify({"data": user_data})
    
    else:
        return jsonify({"error": "User not found"}), 404
 
   
@app.route('/getuserdata', methods=['GET'])
@jwt_required()
def getuserdata():
    current_user = get_jwt_identity()

    user_id = current_user.get("user_id")
    role=current_user.get("role")

    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    if role == 'candidate':
        cursor.execute("select * FROM candidate INNER JOIN user ON candidate.user_id=user.user_id where candidate.user_id = ?", (user_id,))
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"data": rows,})
    else:
        cursor.execute("select * FROM hr INNER JOIN user ON hr.user_id=user.user_id where hr.user_id = ?", (user_id,))
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"data": rows,})
    
# a rout to get stats for the dashboard for hr provide total number of jobs posted, total number of applications received, current active jobs, total number of applications shortlisted
@app.route('/getdashstats', methods=['GET'])
@jwt_required()
def getdashtats():
    current_user = get_jwt_identity()

    user_id = current_user.get("user_id")
    role=current_user.get("role")

    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    if role == 'candidate':
        # for candidate dashboard give total number of jobs applied, total number of applications shortlisted, total number of applications rejected, last job status
        try:
            cursor.execute("select COUNT(*) FROM applications WHERE user_id=?",(user_id,))
            total_jobs = cursor.fetchone()[0]
            cursor.execute("select COUNT(*) FROM applications WHERE user_id=? and status='shortlisted'",(user_id,))
            shortlisted_applications = cursor.fetchone()[0]
            cursor.execute("select COUNT(*) FROM applications WHERE user_id=? and status='rejected'",(user_id,))
            rejected_applications = cursor.fetchone()[0]
            cursor.execute("select * FROM applications INNER JOIN job ON applications.job_id=job.job_id WHERE applications.user_id=? ORDER BY applications.date DESC",(user_id,))
            last_job = cursor.fetchone()['status']
            last_job = last_job.capitalize()
            conn.close()
            if last_job:
                return jsonify({"total_jobs": total_jobs,"shortlisted_applications":shortlisted_applications,"rejected_applications":rejected_applications,"last_job":last_job})
            else:
                return jsonify({"total_jobs": total_jobs,"shortlisted_applications":shortlisted_applications,"rejected_applications":rejected_applications,"last_job":None})
        except:
            # return everythin 0
            return jsonify({"total_jobs": 0,"shortlisted_applications":0,"rejected_applications":0,"last_job":"-"})
    else:
        cursor.execute("select COUNT(*) FROM job WHERE hr_id=?",(user_id,))
        total_jobs = cursor.fetchone()[0]
        cursor.execute("select COUNT(*) FROM applications INNER JOIN job ON applications.job_id=job.job_id WHERE job.hr_id=?",(user_id,))
        total_applications = cursor.fetchone()[0]
        cursor.execute("select COUNT(*) FROM job WHERE hr_id=? and isclosed != 1",(user_id,))
        active_jobs = cursor.fetchone()[0]
        cursor.execute("select COUNT(*) FROM applications INNER JOIN job ON applications.job_id=job.job_id WHERE job.hr_id=? and status='shortlisted'",(user_id,))
        shortlisted_applications = cursor.fetchone()[0]
        conn.close()
        return jsonify({"total_jobs": total_jobs,"total_applications":total_applications,"active_jobs":active_jobs,"shortlisted_applications":shortlisted_applications})

@app.route('/updateuserprofiledata', methods=['POST'])
@jwt_required()
def updateuserprofiledata():
    current_user = get_jwt_identity()

    user_id = current_user.get("user_id")
    role=current_user.get("role")

    data = request.get_json()
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    if role == 'candidate':
        name = data['name']
        phone = data['phone']
        email = data['email']
        qualification = data['qualification']
        cursor.execute("UPDATE candidate SET name=?,phone=?,qualification=? WHERE user_id=?",
                        (name,phone,qualification,user_id))
        conn.commit()
        cursor.execute("UPDATE user SET email=? WHERE user_id=?",
                        (email,user_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        company_name = data['company_name']
        about = data['about']
        cursor.execute("UPDATE hr SET company_name=?,about=? WHERE user_id=?",
                        (company_name,about,user_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Profile updated successfully"}), 200

@app.route('/getuserresumedata', methods=['POST'])
@jwt_required()
def getuserresumedata():
    current_user = get_jwt_identity()
    user_id = current_user.get("user_id")
    role=current_user.get("role")

    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    if role == 'candidate':
        resume=request.files['resume']
        skills=parseresume(resume)
        cursor.execute("select * FROM candidate INNER JOIN user ON candidate.user_id=user.user_id where candidate.user_id = ?", (user_id,))
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        print(skills)
        return jsonify({"data": rows,"skills":skills})
    else:
        return jsonify({"error": "unauthorised"}), 401



@app.route('/getuserjobs', methods=['POST'])
@jwt_required()
def getjuserobs():
    current_user = get_jwt_identity()

    user_id = current_user.get("user_id")

    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT job_id FROM applications WHERE user_id = ?", (user_id,))
    job_ids = cursor.fetchall()
    if job_ids:
        job_id_list = [job[0] for job in job_ids]
        
        cursor.execute("SELECT * FROM job INNER JOIN hr ON job.hr_id = hr.user_id WHERE job.job_id NOT IN ({}) and job.isclosed!=1".format(','.join(['?'] * len(job_id_list))), job_id_list)
    else:
        cursor.execute("SELECT * FROM job INNER JOIN hr ON job.hr_id = hr.user_id where job.isclosed!=1")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    if rows:
        return jsonify({"data": rows})
    else:
        return jsonify({"error": "not found"}), 404
    

@app.route('/getuserappliedjobs', methods=['POST'])
@jwt_required()
def getjuserappliedjobs():
    current_user = get_jwt_identity()

    user_id = current_user.get("user_id")

    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM job INNER JOIN hr ON job.hr_id = hr.user_id INNER JOIN applications ON job.job_id = applications.job_id WHERE applications.user_id = ?", (user_id,))
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    if rows:
        return jsonify({"data": rows})
    else:
        return jsonify({"error": "not found"}), 404


@app.route('/postjob', methods=['POST'])
@jwt_required()
def postjob():
    current_user = get_jwt_identity()

    role = current_user.get("role")
    if(role!="hr"):
        return jsonify({"error": "unauthorised"}), 401

    user_id = current_user.get("user_id")
    data = request.get_json()
    jtitle = data['jtitle']
    jdesc = data['jdesc']
    loc= data['loc']
    qual_req = data['qual_req']
    exp_req = data['exp_req']

    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    date = datetime.now().strftime("%d/%m/%Y")
    cursor.execute("INSERT INTO job (hr_id,job_title, job_description, loc, qualifications_required, experience_required, post_date) VALUES (?,?, ?, ?, ?, ?,?)",
                        (user_id,jtitle, jdesc, loc, qual_req, exp_req,date))

    conn.commit()
    conn.close()
    return jsonify({"message": "Job posted successfully"}), 200


@app.route('/getactivepostings', methods=['GET'])
@jwt_required()
def getactivepostings():
    current_user = get_jwt_identity()

    role = current_user.get("role")
    if(role!="hr"):
        return jsonify({"error": "unauthorised"}), 401

    user_id = current_user.get("user_id")

    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM job WHERE hr_id=? and isclosed != 1",(user_id,))
    rows = [dict(row) for row in cursor.fetchall()]

    application_counts = dict()

    for job in rows:
        job_id = job['job_id']
        cursor.execute("SELECT COUNT(*) FROM applications WHERE job_id=?", (job_id,))
        application_count = cursor.fetchone()[0]
        application_counts[job_id]=application_count

    conn.close()
    if rows:
        return jsonify({"data": rows,"count":application_counts})
    else:
        return jsonify({"error": "not found"}), 404

@app.route('/getclosedpostings', methods=['GET'])
@jwt_required()
def getclosedpostings():
    current_user = get_jwt_identity()

    role = current_user.get("role")
    if(role!="hr"):
        return jsonify({"error": "unauthorised"}), 401

    user_id = current_user.get("user_id")

    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM job WHERE hr_id=? and isclosed = 1",(user_id,))
    rows = [dict(row) for row in cursor.fetchall()]

    application_counts = dict()

    for job in rows:
        job_id = job['job_id']
        cursor.execute("SELECT COUNT(*) FROM applications WHERE job_id=? and status='shortlisted'", (job_id,))
        application_count = cursor.fetchone()[0]
        application_counts[job_id]=application_count

    conn.close()
    if rows:
        return jsonify({"data": rows,"count":application_counts})
    else:
        return jsonify({"error": "not found"}), 404


@app.route('/applyjob', methods=['POST'])
@jwt_required()
def jobapply():
    current_user = get_jwt_identity()

    user_id = current_user.get("user_id")
    jid=request.form["jobid"]
    jdesc=request.form["jobdesc"]

    resume = request.files['resume']
    save_filename=f"{str(user_id)}_{str(jid)}_{resume.filename}"

    resume.save(os.path.join('uploads', save_filename))

    rank=getrank(jdesc,resume)

    extradata=json.loads(request.form["fdata"])
    date = datetime.now().strftime("%d/%m/%Y")
    conn = sqlite3.connect('mydatabase.db')

    cursor = conn.cursor()
    cursor.execute("INSERT INTO applications (user_id,job_id,date,resume,skills,experience,rank) VALUES (?,?,?,?,?,?,?)",
                        (user_id,jid,date,save_filename,extradata["skills"],extradata["experience"],rank))
    
    conn.commit()
    conn.close()
    return jsonify({"message": "Job posted successfully"}), 200



@app.route('/getjobapplicants', methods=['POST'])
@jwt_required()
def getjobapplicants():
    data = request.get_json()
    current_user = get_jwt_identity()
    hr_id = current_user.get("user_id")
    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications INNER JOIN candidate ON applications.user_id=candidate.user_id where applications.job_id = ? order by rank desc", (data["jobid"],)) 
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    if rows:
        return jsonify({"data": rows})
    else:
        return jsonify({"error": "not found"}), 404

@app.route('/getselectedjobapplicants', methods=['POST'])
@jwt_required()
def getselectedjobapplicants():
    data = request.get_json()
    current_user = get_jwt_identity()
    hr_id = current_user.get("user_id")
    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications INNER JOIN candidate ON applications.user_id=candidate.user_id where applications.job_id = ? and status='shortlisted' order by rank desc", (data["jobid"],)) 
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    if rows:
        return jsonify({"data": rows})
    else:
        return jsonify({"error": "not found"}), 404

@app.route('/getresume/<filename>', methods=['GET'])
def getresume(filename):
    return send_from_directory('uploads', filename)

@app.route('/sendemailselected', methods=['POST'])
@jwt_required()
def sendmail():
    data = request.get_json()
    current_user = get_jwt_identity()
    role = current_user.get("role")
    if(role!="hr"):
        return jsonify({"error": "unauthorised"}), 401
    
    user_ids = data["uid_list"]
    job_id = data["jid"]
    emailcontent = data["emailcontent"]
    conn = sqlite3.connect('mydatabase.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()


    cursor.execute("SELECT email FROM user INNER JOIN candidate ON user.user_id=candidate.user_id where candidate.user_id IN ({})".format(','.join(['?'] * len(user_ids))), user_ids)
    email_ids = cursor.fetchall()
    email_id_list = [email[0] for email in email_ids]
    print(email_id_list)

    cursor.execute("SELECT * FROM job INNER JOIN hr ON job.hr_id = hr.user_id WHERE job.job_id = ?", (job_id,))
    job_details = cursor.fetchone()

    job_title=job_details["job_title"]
    job_company = job_details["company_name"]
    

    cursor.execute("UPDATE applications SET status='shortlisted' WHERE job_id=? AND user_id IN ({})".format(','.join(['?'] * len(user_ids))), [job_id]+user_ids)
    conn.commit()
    #set the rest of applications to rejected
    cursor.execute("UPDATE applications SET status='rejected' WHERE job_id=? AND user_id NOT IN ({})".format(','.join(['?'] * len(user_ids))), [job_id]+user_ids)
    conn.commit()

    mailto(email_id_list,"Job Application Status",f"You have been selected for the job of {job_title} at {job_company}.\n\n{emailcontent}")

    cursor.execute("UPDATE job SET isclosed=1 WHERE job_id=?", (job_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "mail sent successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
