local currentlyInGame = false
local passed = false

-----------------
-- dropAmount , the amount of letters to drop for completion
-- Letter , the letter set , letterset 1 = [q,w,e] letterset 2 = [q,w,e,j,k,l] , the set is used to determain what letters will drop
-- speed , the speed that the letters move on the screen
-- inter , interval , the time between letter drops
----------------

function StartLockpickGame(pins)
  OpenLockpick(pins)
  currentlyInGame = true
  playAnim("veh@break_in@0h@p_m_one@", "low_force_entry_ds", -1)
  while currentlyInGame do
    Wait(400)
    if IsEntityPlayingAnim(GetPlayerPed(-1), 'dead', 'dead_a', 1) then 
      CloseLockpick()
    end 
  end
  ClearPedTasks(PlayerPedId())

  return passed
end
exports('StartLockpickGame', StartLockpickGame);

-- NUI Callback Methods
RegisterNUICallback('close', function(data, cb)
  passed = false
  CloseLockpick()
  cb('ok')
end)

RegisterNUICallback('failure', function(data, cb)
  passed = false
  CloseLockpick()
  cb('ok')
end)

RegisterNUICallback('complete', function(data, cb)
  passed = true
  CloseLockpick()
  cb('ok')
end)

RegisterNUICallback('noice', function(data, cb)
  TriggerEvent('InteractSound_CL:PlayOnOne', 'lockpick', 1.0)
  Wait(100)
  cb('ok')
end)


function CloseLockpick()
  SetNuiFocus(false, false)
  SendNUIMessage({openLockpick = false}) 
  currentlyInGame = false
end

function OpenLockpick(pins)
  SetNuiFocus(true, false)
  SendNUIMessage({
    openLockpick = true,
    pins = pins
  })
end

function playAnim(animDict, animName, duration)
    RequestAnimDict(animDict)
    while not HasAnimDictLoaded(animDict) do Citizen.Wait(0) end
    TaskPlayAnim(PlayerPedId(), animDict, animName, 1.0, -1.0, duration, 49, 1, false, false, false)
    RemoveAnimDict(animDict)
end

-- RegisterCommand('lockpick', function()

--   StartLockpickGame(5)

-- end)