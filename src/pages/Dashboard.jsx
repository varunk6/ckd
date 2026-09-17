import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  Activity, 
  Stethoscope, 
  History, 
  TrendingUp, 
  ArrowRight, 
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';

export default function Dashboard() {
  const { 
    bpReadings, 
    labResults, 
    history 
  } = usePrediction();
  
  const navigate = useNavigate();

  // Latest real data (or null if empty)
  const latestBP = bpReadings && bpReadings.length > 0 ? bpReadings[0] : null;
  const latestLab = labResults && labResults.length > 0 ? labResults[0] : null;
  const latestScreening = history && history.length > 0 ? history[0] : null;

  const bpValue = latestBP ? `${latestBP.systolic}/${latestBP.diastolic} mmHg` : '--';
  const bpSub = latestBP ? `Recorded: ${latestBP.date}` : 'No blood pressure readings yet';

  const kidneyValue = latestLab && latestLab.egfr !== null ? `${latestLab.egfr} eGFR` : (latestLab && latestLab.sc !== null ? `${latestLab.sc} mg/dL SC` : '--');
  const kidneySub = latestLab ? `Lab Date: ${latestLab.test_date}` : 'No lab results recorded yet';

  const screeningValue = latestScreening 
    ? (latestScreening.prediction === 'ckd' ? 'Higher Likelihood' : 'Lower Likelihood') 
    : '--';
  const screeningSub = latestScreening 
    ? `${(latestScreening.probability * 100).toFixed(0)}% likelihood (${latestScreening.timestamp})` 
    : 'No screenings completed yet';

  const trendValue = (bpReadings.length > 0 || labResults.length > 0) ? 'Data Active' : '--';
  const trendSub = (bpReadings.length > 0 || labResults.length > 0) ? `${bpReadings.length + labResults.length} records logged` : 'Insufficient entries for trend';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Landing Hero Section */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 md:p-10 text-white shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30">
          <Stethoscope className="w-4 h-4" />
          Simple AI Health Screening
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            CKD <span className="text-[#FF6B00]">Predict</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 font-medium leading-relaxed">
            Understand your kidney health with simple AI-based screening.
          </p>
        </div>

        {/* Primary & Secondary Call-to-Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={() => navigate('/check-health')}
            className="px-6 py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05A00] text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all duration-150 cursor-pointer flex items-center gap-2 group"
          >
            <Stethoscope className="w-5 h-5" />
            <span>Check Your Health</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all duration-150 cursor-pointer flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            <span>View Health History</span>
          </button>
        </div>
      </div>

      {/* Prominent Medical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Medical Disclaimer:</span> This website is intended for educational and research screening purposes only. It is not a medical diagnosis or treatment tool. Consult a qualified healthcare professional for medical advice.
        </div>
      </div>

      {/* 4 Summary Health Cards */}
      <div>
        <h3 className="text-base font-extrabold text-gray-900 mb-4">Your Health Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Blood Pressure */}
          <div 
            onClick={() => navigate('/blood-pressure')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#FF6B00] transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Blood Pressure</span>
              <HeartPulse className="w-5 h-5 text-[#FF6B00] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-gray-900">{bpValue}</div>
            <p className="text-xs text-gray-500">{bpSub}</p>
          </div>

          {/* Card 2: Kidney Health */}
          <div 
            onClick={() => navigate('/kidney-health')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#FF6B00] transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Kidney Health</span>
              <FlaskConical className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-gray-900">{kidneyValue}</div>
            <p className="text-xs text-gray-500">{kidneySub}</p>
          </div>

          {/* Card 3: Latest Screening */}
          <div 
            onClick={() => navigate('/history')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#FF6B00] transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Latest Screening</span>
              <Stethoscope className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className={`text-2xl font-black ${latestScreening?.prediction === 'ckd' ? 'text-rose-600' : 'text-gray-900'}`}>
              {screeningValue}
            </div>
            <p className="text-xs text-gray-500">{screeningSub}</p>
          </div>

          {/* Card 4: Health Trend */}
          <div 
            onClick={() => navigate('/health-trends')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-[#FF6B00] transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Health Trend</span>
              <TrendingUp className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-gray-900">{trendValue}</div>
            <p className="text-xs text-gray-500">{trendSub}</p>
          </div>
        </div>
      </div>

      {/* Simple 3-Step Process Explanation */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">How CKD Predict Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6B00] font-bold flex items-center justify-center shrink-0">1</div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Enter Health Information</h4>
              <p className="text-gray-500 mt-1">Fill out the quick 3-section form with basic info, blood/kidney test numbers, and existing conditions.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6B00] font-bold flex items-center justify-center shrink-0">2</div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Get AI Screening Result</h4>
              <p className="text-gray-500 mt-1">Our machine learning model analyzes your health parameters to estimate CKD likelihood in seconds.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6B00] font-bold flex items-center justify-center shrink-0">3</div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Understand Why & Track Trends</h4>
              <p className="text-gray-500 mt-1">See which factors influenced your result and monitor your blood pressure and lab trends over time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
