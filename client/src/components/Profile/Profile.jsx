import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css'; // We'll create this for custom styles

const Profile = () => {
  // Example data - replace with actual data from your backend
  const userStats = {
    completedCourses: 12,
    avgScore: 85,
    totalStudyTime: "45h",
    learningStreak: 15
  };

  const progressData = [
    { topic: 'Python', progress: 75 },
    { topic: 'Machine Learning', progress: 60 },
    { topic: 'Data Structures', progress: 85 },
    { topic: 'Algorithms', progress: 70 }
  ];

  const recentActivities = [
    { date: '2024-02-07', activity: 'Completed Python Basics Quiz', score: 90 },
    { date: '2024-02-06', activity: 'Started Machine Learning Path', score: null },
    { date: '2024-02-05', activity: 'Completed JavaScript Assessment', score: 85 },
    { date: '2024-02-04', activity: 'Updated Learning Goals', score: null }
  ];

  return (
    <div className="container-fluid py-4">
      {/* Profile Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3 text-center">
                  <div className="position-relative d-inline-block">
                    <img
                      src="/trophy.png"
                      alt="Profile"
                      className="rounded-circle img-thumbnail mb-3"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <span className="position-absolute bottom-0 end-0 p-2 bg-success border border-light rounded-circle">
                    </span>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="ps-md-4">
                    <h2 className="mb-1">{localStorage.getItem("name")}</h2>
                    <p className="text-muted mb-2">AI & Machine Learning Enthusiast</p>
                    <p className="small text-muted">Member since January 2024</p>
                    <div className="mb-3">
                      <span className="badge bg-primary me-2">Python</span>
                      <span className="badge bg-secondary me-2">Machine Learning</span>
                      <span className="badge bg-info me-2">Data Science</span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm me-2">Edit Profile</button>
                    <button className="btn btn-outline-secondary btn-sm">Settings</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-book fs-3 text-primary mb-2"></i>
              <h5 className="card-title">{userStats.completedCourses}</h5>
              <p className="card-text text-muted">Completed Courses</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-trophy fs-3 text-warning mb-2"></i>
              <h5 className="card-title">{userStats.avgScore}%</h5>
              <p className="card-text text-muted">Average Score</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-clock fs-3 text-info mb-2"></i>
              <h5 className="card-title">{userStats.totalStudyTime}</h5>
              <p className="card-text text-muted">Total Study Time</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-lightning fs-3 text-danger mb-2"></i>
              <h5 className="card-title">{userStats.learningStreak} days</h5>
              <p className="card-text text-muted">Learning Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress and Recent Activity */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Learning Progress</h5>
            </div>
            <div className="card-body">
              {progressData.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{item.topic}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${item.progress}%` }}
                      aria-valuenow={item.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <p className="mb-1">{activity.activity}</p>
                      {activity.score && (
                        <span className="badge bg-success">{activity.score}%</span>
                      )}
                    </div>
                    <small className="text-muted">{activity.date}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Learning Recommendations */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">AI Learning Recommendations</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="col-md-4 mb-3">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title">Recommended Path {item}</h6>
                        <p className="card-text text-muted small">
                          Based on your progress and interests, we recommend exploring this learning path.
                        </p>
                        <button className="btn btn-outline-primary btn-sm">Start Learning</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;