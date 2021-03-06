import { AdvancedConfig } from './advancedConfig.js';
import { MODULE_ID } from '../constants';
import { log, LogLevel } from './logging';
import { BloodNGuts } from '../blood-n-guts.js';

import * as bloodColorSettings from '../data/bloodColorSettings';
import * as violenceLevelSettings from '../data/violenceLevelSettings';

/**
 * Registers settings.
 * @module Settings
 */

/**
 * Register module settings.
 * @function
 */
export const registerSettings = (): void => {
  game.settings.register(MODULE_ID, 'useBloodColor', {
    name: 'Blood Color',
    hint: 'If unchecked all blood will be red',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: useBloodColor set to ' + value);
      if (!canvas.scene.active)
        ui.notifications.notify(`Note: Blood 'n Guts does not work on non-active scenes!`, 'warning');
    },
  });

  game.settings.register(MODULE_ID, 'halfHealthBloodied', {
    name: '50% Health = Bloodied',
    hint: 'Common house rule to show bleeding effects at 50% of max health',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: halfHealthBloodied set to ' + value);
      game.settings.set(MODULE_ID, 'healthThreshold', 0.51);
      game.settings.set(MODULE_ID, 'damageThreshold', 0);
      if (!canvas.scene.active)
        ui.notifications.notify(`Note: Blood 'n Guts does not work on non-active scenes!`, 'warning');
    },
  });

  game.settings.registerMenu(MODULE_ID, 'advancedConfig', {
    name: 'Advanced Config',
    label: 'Advanced Configuration',
    hint: 'Access advanced configuration menu to find additional options',
    icon: 'fas fa-desktop',
    type: AdvancedConfig,
    restricted: true,
  });

  // Settings in Advanced Configuration
  game.settings.register(MODULE_ID, 'floorSplatFont', {
    scope: 'world',
    config: false,
    type: String,
    default: 'splatter',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: floorSplatFont set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'tokenSplatFont', {
    scope: 'world',
    config: false,
    type: String,
    default: 'splatter',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: tokenSplatFont set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'trailSplatFont', {
    scope: 'world',
    config: false,
    type: String,
    default: 'WC Rhesus A Bta',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: trailSplatFont set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'floorSplatSize', {
    scope: 'client',
    config: false,
    type: Number,
    default: '150',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: floorSplatSize set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'floorSplatDensity', {
    scope: 'client',
    config: false,
    type: Number,
    default: '1',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: floorSplatDensity set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'tokenSplatSize', {
    scope: 'client',
    config: false,
    type: Number,
    default: '40',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: tokenSplatSize set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'tokenSplatDensity', {
    scope: 'client',
    config: false,
    type: Number,
    default: '1',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: tokenSplatDensity set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'trailSplatSize', {
    scope: 'client',
    config: false,
    type: Number,
    default: '30',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: trailSplatSize set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'trailSplatDensity', {
    scope: 'client',
    config: false,
    type: Number,
    default: '3',
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: trailSplatDensity set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'splatSpread', {
    scope: 'client',
    config: false,
    type: Number,
    default: 0.8,
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: splatSpread set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'healthThreshold', {
    scope: 'client',
    config: false,
    type: Number,
    default: 1.0,
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: healthThreshold set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'damageThreshold', {
    scope: 'client',
    config: false,
    type: Number,
    default: 0.0,
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: damageThreshold set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'deathMultiplier', {
    scope: 'client',
    config: false,
    type: Number,
    default: 2,
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: deathMultiplier set to ' + value);
    },
  });

  game.settings.register(MODULE_ID, 'sceneSplatPoolSize', {
    scope: 'client',
    config: false,
    type: Number,
    default: 100,
    onChange: (value) => {
      log(LogLevel.DEBUG, 'Settings: sceneSplatPoolSize set to ' + value);
    },
  });

  getMergedViolenceLevelArray.then((mergedViolenceLevels: any) => {
    let index = 0;
    const violenceLevelChoices = {};
    mergedViolenceLevels.forEach((level) => {
      violenceLevelChoices[String(index++)] = level.name;
    });
    game.settings.register(MODULE_ID, 'violenceLevel', {
      name: game.i18n.localize('Violence Level'),
      hint: game.i18n.localize('Blood and gore level'),

      scope: 'client',
      config: true,
      type: Number,
      choices: violenceLevelChoices,
      default: 2,
      onChange: (value) => {
        // when violenceLevel is changed we load that violenceLevel from our merged levels
        const violenceLevel = duplicate(mergedViolenceLevels[value]);
        delete violenceLevel.name;
        for (const key in violenceLevel) {
          game.settings.set(MODULE_ID, key, violenceLevel[key]);
        }

        if (value === '0') {
          BloodNGuts.disabled = true;
          BloodNGuts.wipeAllSplats();
          return;
        } else if (BloodNGuts.disabled) BloodNGuts.disabled = false;

        if (!canvas.scene.active) {
          ui.notifications.notify(`Note: Blood 'n Guts does not work on non-active scenes!`, 'warning');
          return;
        }
        //if the scenePool has increased in size we need to repopulate it
        const sceneSplatsFlag = canvas.scene.getFlag(MODULE_ID, 'sceneSplats');
        if (sceneSplatsFlag) {
          const sceneSplats = duplicate(sceneSplatsFlag);
          if (sceneSplats && sceneSplats.length) {
            const trimmedSceneSplats = BloodNGuts.getTrimmedSceneSplats(sceneSplats);
            // trim to new ScenePool size and draw
            BloodNGuts.drawSceneSplats(trimmedSceneSplats);
          }
        }
      },
    });
  });
};

// Custom Settings

let splatFontsResolved;
let bloodColorSettingsResolved;
let violenceLevelSettingsResolved;

/**
 * Promise resolving after custom splat fonts are loaded from disk.
 * @function
 * @category GMOnly
 * @returns {Promise<any>} - promise resolving to only the custom splat fonts.
 */
export const getCustomSplatFonts = new Promise((resolve) => {
  splatFontsResolved = resolve;
});

/**
 * Promise resolving after custom blood colors are loaded from disk.
 * @function
 * @category GMOnly
 * @returns {Promise<any>} - promise resolving to custom and normal colors merged.
 */
export const getMergedBloodColorSettings = new Promise((resolve) => {
  bloodColorSettingsResolved = resolve;
});

/**
 * Promise resolving after custom violence levels are loaded from disk.
 * @function
 * @category GMOnly
 * @returns {Promise<SplatFont[]>} - promise resolving to custom and normal violence levels merged.
 */
export const getMergedViolenceLevelArray = new Promise((resolve) => {
  violenceLevelSettingsResolved = resolve;
});

/**
 * Initiate the loading and merging of custom settings files from the 'Data/blood-n-guts/' folder.
 * @function
 * @async
 * @category GMOnly
 * @returns {Promise<void>}
 */
export const mergeSettingsFiles = async (): Promise<void> => {
  const customFileNames = [
    'customSplatFonts.json',
    'customBloodColorSettings.json',
    'customViolenceLevelSettings.json',
  ];
  let filesToMerge: string[] = [];

  // create main folder if missing
  await FilePicker.createDirectory('data', MODULE_ID, {})
    .then((result) => {
      log(LogLevel.INFO, `mergeSettingsFiles, creating ${result}`);
    })
    .catch((err) => {
      if (!err.includes('EEXIST')) {
        log(LogLevel.ERROR, 'mergeSettingsFiles', err);
      }
    });

  // create fonts folder if missing
  await FilePicker.createDirectory('data', MODULE_ID + '/fonts', {})
    .then((result) => {
      log(LogLevel.INFO, `mergeSettingsFiles, creating ${result}`);
    })
    .catch((err) => {
      if (!err.includes('EEXIST')) {
        log(LogLevel.ERROR, 'mergeSettingsFiles', err);
      }
    });

  // check if we need to create the custom settings files, if we do then they obviously do not need to be merged.
  await FilePicker.browse('data', MODULE_ID + '/*', {})
    .then((res) => {
      const extantFiles = res.files.map((fullPath) => fullPath.slice(fullPath.lastIndexOf('/') + 1));
      const filesToCreate = customFileNames.filter((filename) => !extantFiles.includes(filename));
      filesToCreate.forEach((filename) => {
        const file = new File(['{}'], filename);
        FilePicker.upload('data', MODULE_ID + '/', file, {});
      });
      filesToMerge = customFileNames.filter((filename) => !filesToCreate.includes(filename));
    })
    .catch((err) => {
      log(LogLevel.ERROR, 'mergeSettingsFiles', err);
    });

  // somewhat different processes depending on custom settings type
  if (filesToMerge.includes('customSplatFonts.json')) {
    const response = await fetch(MODULE_ID + '/customSplatFonts.json');
    try {
      const customSplatFonts = await response.json();
      for (const font in customSplatFonts) {
        // turn into array to match splatFonts
        customSplatFonts[font].availableGlyphs = [...customSplatFonts[font].availableGlyphs];
      }
      splatFontsResolved({ fonts: customSplatFonts });
    } catch (err) {
      log(LogLevel.ERROR, 'mergeSettingsFiles', err);
    }
  } else splatFontsResolved();

  if (filesToMerge.includes('customBloodColorSettings.json')) {
    const response = await fetch(MODULE_ID + '/customBloodColorSettings.json');
    try {
      const customBloodColorSettings = await response.json();
      const santisedCustomSettings = {};
      for (const key in customBloodColorSettings) {
        santisedCustomSettings[key.toLowerCase()] = customBloodColorSettings[key];
      }
      const mergedBloodColorSettings = Object.assign(bloodColorSettings.colors, santisedCustomSettings);
      bloodColorSettingsResolved(mergedBloodColorSettings);
    } catch (err) {
      log(LogLevel.ERROR, 'mergeSettingsFiles', err);
    }
  } else bloodColorSettingsResolved(bloodColorSettings.colors);

  if (filesToMerge.includes('customViolenceLevelSettings.json')) {
    const response = await fetch(MODULE_ID + '/customViolenceLevelSettings.json');
    try {
      const customViolenceLevelSettings = await response.json();
      const mergedViolenceLevelSettings = Object.assign(violenceLevelSettings.levels, customViolenceLevelSettings);
      const mergedViolenceLevelArray = [];
      for (const level in mergedViolenceLevelSettings) {
        mergedViolenceLevelSettings[level].name = level;
        mergedViolenceLevelArray.push(mergedViolenceLevelSettings[level]);
      }
      violenceLevelSettingsResolved(mergedViolenceLevelArray);
    } catch (err) {
      log(LogLevel.ERROR, 'mergeSettingsFiles', err);
    }
  } else {
    const mergedViolenceLevelArray = [];
    for (const level in violenceLevelSettings.levels) {
      violenceLevelSettings.levels[level].name = level;
      mergedViolenceLevelArray.push(violenceLevelSettings.levels[level]);
    }
    violenceLevelSettingsResolved(mergedViolenceLevelArray);
  }
};
