# frozen_string_literal: true

Fabricator(:screened_email) do
  email { sequence(:email) { |n| "bad#{n}@spammers.org" } }
  action_type do
    sequence(:action_type) do |n|
      index = n % ScreenedEmail.actions.length + 1
      ScreenedEmail.actions[index]
    end
  end
  match_count do
    sequence(:match_count) do |n|
      puts "match_count #{n}"
      n
    end
  end
  last_match_at { sequence(:last_match_at) { |n| Time.now + n.days } }
  created_at { sequence(:created_at) { |n| Time.now + n.days } }
  ip_address { sequence(:ip_address) { |i| "99.232.23.#{i % 254}" } }
end
