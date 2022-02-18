           Инструкция

установить node js

далее в папке с ботом открыть powershell или cmd

npm install


            Конфигурация 

в файле claim.js в privatekey - вставить свой приватный ключ

            В data
            
name: - 'claimdropwl' для дропа с вл , 'claimdrop' для дропа без вл
data actor:  -  вставить имя своего аккаунта
drop_id: - id дропа

           Дальше
           
saletime - время дропа в epoch time
howearly - наскольно раньше толкнуть транзакцию в сеть(миллисекунды), рекомендую ставить хотя бы 800-900

           Запуск

открыть в папке с ботом powershell или cmd

за минуту до дропа

npm run claim


