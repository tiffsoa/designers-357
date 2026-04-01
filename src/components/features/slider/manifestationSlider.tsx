"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Sparkles, TrendingUp, Calendar } from "lucide-react"

const getUserProfile = () => ({
  weeklySavings: 50,
  weeklyIncome: 500,
})

const saveUserProfile = (profile: any) => {
  console.log("saved", profile)
}

export default function ManifestationSlider() {
  const [profile, setProfile] = useState(getUserProfile())
  const [savingsValue, setSavingsValue] = useState([profile.weeklySavings])

  const monthlyImpact = savingsValue[0] * 4.33
  const yearlyImpact = savingsValue[0] * 52
  const yearlyWithInterest = yearlyImpact * 1.04

  const handleValueChange = (value: number[]) => {
    setSavingsValue(value)
  }

  const handleValueCommit = (value: number[]) => {
    const newProfile = { ...profile, weeklySavings: value[0] }
    setProfile(newProfile)
    saveUserProfile(newProfile)
  }

  const getMotivationalMessage = () => {
    const pct = (savingsValue[0] / profile.weeklyIncome) * 100
    if (pct < 10) return "Every journey starts with a small step 🌱"
    if (pct < 20) return "You're building momentum 🚀"
    if (pct < 30) return "Incredible discipline 💪"
    return "Financial legend in the making 🌟"
  }

  const getSliderColor = () => {
    const pct = (savingsValue[0] / profile.weeklyIncome) * 100
    if (pct < 10) return "from-orange-400 to-pink-400"
    if (pct < 20) return "from-yellow-400 to-orange-400"
    if (pct < 30) return "from-green-400 to-emerald-400"
    return "from-emerald-400 to-teal-400"
  }

  return (
    <div className="mt-8 mb-8 px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-green-600" />
            Manifestation Slider
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Watch your future unfold as you adjust
          </p>
        </div>

        <div className="mb-6 text-center">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-5xl font-bold text-transparent">
            ${savingsValue[0]}
          </div>
          <div className="text-sm text-gray-600">per week</div>
          <div className="mt-2 font-medium text-green-700">
            {getMotivationalMessage()}
          </div>
        </div>

        <div className="mb-6 px-4">
          <Slider
            value={savingsValue}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            max={profile.weeklyIncome}
            step={5}
          />
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>${profile.weeklyIncome}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className={`rounded-xl bg-gradient-to-r ${getSliderColor()} p-4 text-white`}>
            <Calendar className="mb-1 h-6 w-6" />
            <div className="text-xl font-bold">${monthlyImpact.toFixed(0)}</div>
            <div className="text-xs">Per Month</div>
          </div>

          <div className={`rounded-xl bg-gradient-to-r ${getSliderColor()} p-4 text-white`}>
            <TrendingUp className="mb-1 h-6 w-6" />
            <div className="text-xl font-bold">${yearlyImpact.toFixed(0)}</div>
            <div className="text-xs">Per Year</div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
            <Sparkles className="mb-1 h-6 w-6" />
            <div className="text-xl font-bold">${yearlyWithInterest.toFixed(0)}</div>
            <div className="text-xs">With Interest</div>
          </div>
        </div>
      </div>
    </div>
  )
}