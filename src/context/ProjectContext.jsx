import React, { createContext, useContext, useState } from 'react';
import { DEMO_PROJECT } from '../data/demoData';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projectName, setProjectName] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // 'idle' | 'running' | 'complete'
  const [isDemo, setIsDemo] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [progressStep, setProgressStep] = useState(0);
  const [progressPct, setProgressPct] = useState(0);

  // Clear state flags
  const projectLoaded = Boolean(projectName || uploadedFile || isDemo);
  const analysisStarted = analysisStatus === 'running' || analysisStatus === 'complete';
  const analysisComplete = analysisStatus === 'complete';
  const isLocked = !analysisComplete;

  const loadDemoProject = () => {
    setIsDemo(true);
    setUploadedFile(null);
    setProjectName(DEMO_PROJECT.name);
    setAnalysisStatus('idle');
    setProgressStep(0);
    setProgressPct(0);
  };

  const selectZipFile = (file) => {
    if (!file) return;
    setUploadedFile({ name: file.name, size: file.size });
    setIsDemo(false);
    setProjectName(file.name.replace(/\.zip$/i, ''));
    setAnalysisStatus('idle');
    setProgressStep(0);
    setProgressPct(0);
  };

  const startAnalysis = () => {
    if (!projectName) {
      setIsDemo(true);
      setProjectName(DEMO_PROJECT.name);
    }
    setAnalysisStatus('running');
    setProgressStep(0);
    setProgressPct(0);
  };

  const updateProgress = (step, pct) => {
    setProgressStep(step);
    setProgressPct(pct);
  };

  const completeAnalysis = () => {
    setAnalysisStatus('complete');
    setProgressStep(8);
    setProgressPct(100);
  };

  const resetAnalysis = () => {
    setProjectName('');
    setAnalysisStatus('idle');
    setIsDemo(false);
    setUploadedFile(null);
    setProgressStep(0);
    setProgressPct(0);
  };

  const clearSelectedProject = () => {
    setUploadedFile(null);
    setIsDemo(false);
    setProjectName('');
    setAnalysisStatus('idle');
    setProgressStep(0);
    setProgressPct(0);
  };

  return (
    <ProjectContext.Provider
      value={{
        projectName,
        analysisStatus,
        isDemo,
        uploadedFile,
        progressStep,
        progressPct,
        projectLoaded,
        analysisStarted,
        analysisComplete,
        isLocked,
        loadDemoProject,
        selectZipFile,
        startAnalysis,
        updateProgress,
        completeAnalysis,
        resetAnalysis,
        clearSelectedProject,
        demoProject: DEMO_PROJECT,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;
