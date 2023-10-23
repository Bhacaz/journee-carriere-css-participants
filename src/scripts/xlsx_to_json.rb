
require 'bundler/inline'
require 'json'

gemfile do
  source 'https://rubygems.org'
  gem 'roo'
end

xlsx = Roo::Spreadsheet.open('./data/data.xlsx')

sheet = xlsx.sheet(0)

sheet.row(2).each_with_index { |cell, index| puts "#{index}: #{cell}" }

# 4: Nom
# 5: Prénom
# 8: Quel est le titre de votre emploi ?
# 9: Afin d'aider les élèves à comprendre et à s'intéresser à votre emploi, décrivez-nous brièvement ce que vous faites. Ce texte servira aux élèves lorsqu'ils devront choisir leurs conférences.
# 10: Le niveau d'études pour occuper cet emploi habituellement.
# 18: Lien repères
# 19: CODE HOLLAND
# 20: CODE HOLLAND
# 21: CODE HOLLAND
# 22: Heure de conférence

COLUMNS_INDEX = [
  4, # Nom
  5, # Prénom
  8, # Quel est le titre de votre emploi ?
  9, # Afin d'aider les élèves à comprendre et à s'intéresser à votre emploi, décrivez-nous brièvement ce que vous faites. Ce texte servira aux élèves lorsqu'ils devront choisir leurs conférences.
  10, # Le niveau d'études pour occuper cet emploi habituellement.
  18, # Lien repères
  22, # Heure de conférence
]

CODE_HOLLAND_INDEX = [
  19, # CODE HOLLAND
  20, # CODE HOLLAND
  21, # CODE HOLLAND
]

Participants = Struct.new(
  :name,
  :title,
  :domain,
  :formation,
  :description,
  :period,
  :link_reperes,
  :holland_codes
)

FIRST_PARTICIPANT_ROW_INDEX = 3

participants = []

(FIRST_PARTICIPANT_ROW_INDEX..sheet.last_row).each do |row_index|
  row = sheet.row(row_index)

  code_hollands = CODE_HOLLAND_INDEX.map { |index| row[index] }.compact

  participants << Participants.new(
    row[COLUMNS_INDEX[1]] + " " + row[COLUMNS_INDEX[0]],
    row[COLUMNS_INDEX[2]],
    'TBD',
    row[COLUMNS_INDEX[4]],
    row[COLUMNS_INDEX[3]],
    row[COLUMNS_INDEX[6]],
    row[COLUMNS_INDEX[5]],
    code_hollands
  )
end

json = JSON.pretty_generate(participants.map(&:to_h))

File.open('./src/models/participants.json', 'w') { |file| file.write(json) }
