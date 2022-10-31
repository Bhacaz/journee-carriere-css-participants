require 'json'
require 'csv'

participants = []

CSV.open('./data/data.csv', 'r', headers: true) do |csv|
  csv.each do |row|
    participants << {
      name: row['Prénom'] + " " + row['Nom'],
      title: row["Quel est le titre de votre emploi ?"],
      domain: row['Métier'] || '',
      formation: row["Le niveau d'études pour occuper cet emploi habituellement."],
      description: row[ "Afin d'aider les élèves à comprendre et à s'intéresser à votre emploi, décrivez-nous brièvement ce que vous faites. Ce texte servira aux élèves lorsqu'ils devront choisir leurs conférences."],
      period: row["HEURE"].split(',').first,
      link_reperes: row["Lien repères"],
      holland_codes: [row["CODE HOLLAND 1"], row["CODE HOLLAND 2"], row["CODE HOLLAND 3"]],
    }
  end
end

json = JSON.pretty_generate(participants)
File.open('./src/models/participants.json', 'w') { |file| file.write(json) }
