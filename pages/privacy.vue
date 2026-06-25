<script setup lang="ts">
const title = 'Política de Privacidade – Ambo Market';
const description = 'Saiba como a Ambo Market recolhe, utiliza e protege os seus dados pessoais de acordo com a nossa Política de Privacidade.';

useHead({
  title,
  meta: [
    { key: 'description', name: 'description', content: description },
    { key: 'og:title', property: 'og:title', content: title },
    { key: 'og:description', property: 'og:description', content: description },
    { key: 'twitter:title', property: 'twitter:title', content: title },
    { key: 'twitter:description', property: 'twitter:description', content: description },
    { key: 'robots', name: 'robots', content: 'noindex, follow' },
  ],
});
</script>

<template>
  <article
    class="mx-auto max-w-3xl space-y-5 py-6 text-sm leading-7 text-default sm:py-10 sm:text-base [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_table]:w-full [&_table]:min-w-[500px] [&_table]:border-collapse [&_td]:border [&_td]:border-default [&_td]:p-3 [&_td]:align-top [&_th]:border [&_th]:border-default [&_th]:bg-muted/40 [&_th]:p-3 [&_th]:text-left [&_th]:align-top [&_th]:font-semibold [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-highlighted"
  >
    <h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
      Política de Privacidade
    </h1>

    <div>
      <UBadge
        color="neutral"
        variant="soft"
      >
        Data de Vigência:&nbsp;<strong>15 de Março de 2026</strong>
      </UBadge>
    </div>

    <p class="font-semibold uppercase tracking-wide text-highlighted">
      O que abrange esta política de privacidade?
    </p>

    <p>
      A sua privacidade é extremamente importante para a <a
        href="https://ambo.market/"
        target="_blank"
        rel="noreferrer"
      >Ambo Market</a>.

      Estamos empenhados em proteger os seus Dados Pessoais (conforme definido mais abaixo). Queremos ser
      transparentes consigo sobre como recolhemos e utilizamos os seus Dados Pessoais ao disponibilizar a nossa
      plataforma (<strong>"Plataforma"</strong>) e informá-lo sobre os seus direitos de privacidade e como a lei o
      protege.
    </p>

    <p>
      Esta Política de Privacidade tem como objectivo fornecer-lhe informações sobre como a Ambo Market recolhe e
      trata os seus Dados Pessoais através da sua utilização desta Plataforma.
    </p>

    <p>
      Ao utilizar a Plataforma, concorda com a recolha, utilização e transferência dos seus Dados Pessoais conforme
      estabelecido nesta Política de Privacidade.
    </p>

    <p>
      Com isso em mente, esta Política de Privacidade abrange o seguinte:
    </p>

    <ul class="grid list-none gap-2 rounded-md border border-default bg-muted/30 p-3 sm:grid-cols-2">
      <li>
        <a
          href="#how-to-contact-us"
          class="block font-semibold uppercase"
        >Quem somos e como nos contactar</a>
      </li>

      <li>
        <a
          href="#personal-data"
          class="block font-semibold uppercase"
        >Dados pessoais que recolhemos de si</a>
      </li>

      <li>
        <a
          href="#personal-data-usage"
          class="block font-semibold uppercase"
        >Como utilizamos os seus dados pessoais e porquê</a>
      </li>

      <li>
        <a
          href="#personal-data-share"
          class="block font-semibold uppercase"
        >Com quem partilhamos os seus dados pessoais</a>
      </li>

      <li>
        <a
          href="#personal-data-secure"
          class="block font-semibold uppercase"
        >Como mantemos os seus dados pessoais seguros</a>
      </li>

      <li>
        <a
          href="#store-personal-data"
          class="block font-semibold uppercase"
        >Por quanto tempo conservamos os seus dados pessoais</a>
      </li>

      <li>
        <a
          href="#rights-to-personal-data"
          class="block font-semibold uppercase"
        >Os seus direitos em relação aos seus dados pessoais</a>
      </li>

      <li>
        <a
          href="#marketing-communications"
          class="block font-semibold uppercase"
        >Comunicações de Marketing</a>
      </li>

      <li>
        <a
          href="#policy-on-minor"
          class="block font-semibold uppercase"
        >A nossa política sobre menores</a>
      </li>

      <li>
        <a
          href="#third-party-links"
          class="block font-semibold uppercase"
        >Links de terceiros</a>
      </li>

      <li>
        <a
          href="#changes-to-privacy-policy"
          class="block font-semibold uppercase"
        >Alterações a esta política de privacidade</a>
      </li>
    </ul>

    <p>
      <strong>Podemos rever esta Política de Privacidade de tempos em tempos, com ou sem aviso prévio.</strong> Caso
      isso aconteça, a nova versão desta Política de Privacidade será disponibilizada nesta página.
    </p>

    <p>
      Esta Política de Privacidade pode ser publicada em diferentes idiomas. Se existirem inconsistências entre
      versões, prevalecerá a versão em língua inglesa.
    </p>

    <div
      id="how-to-contact-us"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Quem somos e como nos contactar
      </p>

      <p class="font-semibold text-highlighted">
        Quem somos
      </p>

      <p>
        A <strong>Ambo Market</strong>

        opera a Plataforma e é, portanto, o responsável pelo tratamento dos seus Dados Pessoais (referido como
        "<strong>Ambo Market</strong>

        ", "<strong>nós</strong>

        ", "<strong>nos</strong>

        " ou "<strong>nosso</strong>"
        nesta Política de Privacidade). A nossa morada é Angola, Soyo, Projecto Cajueiro, 32 Soyo, Zaire Angola.
      </p>

      <p class="font-semibold text-highlighted">
        Como nos contactar
      </p>

      <p>
        Pode contactar-nos por e-mail: <a href="mailto:support@ambo.market">support@ambo.market</a>.
      </p>
    </div>

    <div
      id="personal-data"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Dados pessoais que recolhemos de si
      </p>

      <p>
        Os Dados Pessoais que recolhemos directamente de si estão descritos na tabela abaixo.
      </p>

      <p>
        "<strong>Dados Pessoais</strong>"
        &nbsp;são informações sobre um indivíduo a partir das quais esse indivíduo é directamente identificado ou
        pode ser identificado. <strong>Não</strong>
        inclui "dados anonimizados" (informações em que a identidade de
        um indivíduo foi permanentemente removida). Contudo, <strong>inclui</strong> "dados pseudonimizados"
        (informações que, por si só, não identificam um indivíduo mas que, combinadas com informações adicionais,
        podem ser usadas para identificar um indivíduo).
      </p>

      <div class="overflow-x-auto rounded-md border border-default">
        <table>
          <thead>
            <tr>
              <th scope="col">
                Categoria de Dados Pessoais
              </th>

              <th
                scope="col"
                colspan="2"
              >
                O que isso significa
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                Dados de Identificação
              </td>

              <td>
                <p>
                  Nome próprio, apelido, nome de utilizador ou identificador semelhante e fotografia de perfil.
                </p>

                <p>
                  Caso decida verificar a sua conta através da funcionalidade "Ambo Market Verificado", iremos também
                  tratar uma cópia do seu Bilhete de Identidade com todas as informações nele contidas (incluindo o
                  número do BI, data de nascimento, nacionalidade e género). Utilizamos medidas robustas para manter
                  esta informação segura e prevenir acções fraudulentas ou maliciosas, como roubo de identidade,
                  burlas de phishing, fraudes de não entrega e de pagamento.
                </p>

                <p>
                  Se estiver a efectuar um test drive e/ou a adquirir um automóvel através da Ambo Market Cars,
                  iremos tratar dados adicionais, incluindo os detalhes da sua carta de condução.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                Dados de Contacto
              </td>

              <td>
                Endereço de e-mail, número(s) de telefone.
              </td>
            </tr>

            <tr>
              <td>
                Dados de Localização
              </td>

              <td>
                Localização aproximada, se activar esta funcionalidade no seu dispositivo.
              </td>
            </tr>

            <tr>
              <td>
                Dados de Anúncios
              </td>

              <td>
                Detalhes sobre os seus anúncios anteriores e actuais na Plataforma, bem como detalhes dos anúncios de
                outros utilizadores que visualizou e propostas que realizou para anúncios de outros utilizadores.
              </td>
            </tr>

            <tr>
              <td>
                Dados de Marketing
              </td>

              <td>
                As suas preferências relativamente ao recebimento de mensagens de marketing da nossa parte.
              </td>
            </tr>

            <tr>
              <td>
                Dados de Chat
              </td>

              <td>
                Detalhes das mensagens que troca com outros utilizadores da Plataforma através da funcionalidade
                "Chat", incluindo quaisquer Dados Pessoais adicionais que possa divulgar nessas mensagens.
              </td>
            </tr>

            <tr>
              <td>
                Dados de Chamadas
              </td>

              <td>
                Gravações de chamadas entre si e as nossas equipas, efectuadas para fins de monitorização e
                formação.
              </td>
            </tr>

            <tr>
              <td>
                Dados Comportamentais
              </td>

              <td>
                Informações inferidas ou assumidas sobre o seu comportamento e interesses com base na sua actividade
                na Plataforma. Normalmente, estas informações são compiladas e agrupadas em "segmentos" de forma
                agregada.
              </td>
            </tr>

            <tr>
              <td>
                Dados Técnicos
              </td>

              <td>
                Endereço de protocolo de Internet (IP), dados de início de sessão, tipo e versão do navegador,
                definição de fuso horário e localização, tipos e versões de plug-ins do navegador, sistema operativo
                e plataforma, e outras tecnologias nos dispositivos que utiliza para aceder a este website ou
                utilizar os nossos serviços.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="font-semibold text-highlighted">
        Dados agregados
      </p>

      <p>
        Também recolhemos, utilizamos e partilhamos "dados agregados", como dados estatísticos ou demográficos, para
        diversas finalidades. Os dados agregados podem ser derivados dos seus Dados Pessoais, mas uma vez em forma
        agregada deixarão de constituir Dados Pessoais, pois não revelam directa nem indirectamente a sua
        identidade. Por exemplo, podemos agregar os seus Dados Comportamentais para calcular a percentagem de
        utilizadores que acede a uma funcionalidade específica da Plataforma. Contudo, se combinarmos ou ligarmos
        dados agregados aos seus Dados Pessoais de forma a poder identificá-lo directa ou indirectamente,
        trataremos os dados combinados como Dados Pessoais, que serão utilizados em conformidade com esta Política
        de Privacidade.
      </p>

      <p class="font-semibold text-highlighted">
        Categorias especiais de dados pessoais
      </p>

      <p>
        Não recolhemos conscientemente quaisquer "categorias especiais de dados pessoais" sobre si (o que inclui,
        por exemplo, detalhes sobre a sua raça ou etnia, crenças religiosas ou filosóficas, opiniões políticas,
        informações sobre a sua saúde, dados genéticos e/ou biométricos, e informações sobre infracções e
        condenações criminais).
      </p>

      <p>
        Aconselhamo-lo a não partilhar nenhum desses dados connosco (por exemplo, através da nossa função de chat de
        apoio) nem com outros utilizadores da Plataforma (por exemplo, através da função de chat entre utilizadores).
        Contudo, caso opte por partilhar tais dados connosco ou com outros utilizadores da Plataforma, consente que
        tratemos esses dados em conformidade com esta Política de Privacidade.
      </p>

      <p class="font-semibold text-highlighted">
        O que acontece se recusar fornecer os Dados Pessoais necessários?
      </p>

      <p>
        Não é obrigado a fornecer-nos quaisquer Dados Pessoais. Contudo, quando <strong>necessitamos</strong>

        de tratar os seus Dados Pessoais para lhe conceder acesso à Plataforma ou para cumprir a legislação
        aplicável, e não fornecer esses Dados Pessoais quando solicitado, poderemos não conseguir disponibilizar-lhe
        o acesso à Plataforma. Por exemplo, <strong>necessitamos</strong> do seu endereço de e-mail para registar a
        sua conta na Plataforma.
      </p>
    </div>

    <div
      id="personal-data-usage"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Como utilizamos os seus dados pessoais e porquê
      </p>

      <p>
        Utilizaremos os seus Dados Pessoais apenas para as finalidades para as quais os recolhemos, conforme listado
        abaixo, a menos que consideremos razoavelmente necessário utilizá-los para outra finalidade compatível com o
        propósito original. Se precisarmos de utilizar os seus Dados Pessoais para uma finalidade não relacionada,
        actualizaremos esta Política de Privacidade e explicaremos a base legal que nos permite fazê-lo (consulte a
        secção "Alterações a esta Política de Privacidade" mais abaixo).
      </p>

      <p class="font-semibold text-highlighted">
        Qual é a nossa "base legal" para o tratamento dos seus Dados Pessoais?
      </p>

      <p>
        Relativamente a cada uma das finalidades para as quais utilizamos os seus Dados Pessoais, as leis de
        privacidade aplicáveis exigem que tenhamos uma "base legal" para esse tratamento. Normalmente, apoiamo-nos
        numa das seguintes bases legais:
      </p>

      <ul>
        <li>
          Quando necessitamos de tratar os seus Dados Pessoais para cumprir as nossas obrigações contratuais para
          consigo (por exemplo, para lhe fornecer acesso à Plataforma) ("<strong>Necessidade Contratual</strong>").
        </li>

        <li>
          Quando necessitamos de tratar os seus Dados Pessoais para cumprir as nossas obrigações legais ou
          regulamentares ("<strong>Cumprimento da Lei</strong>").
        </li>

        <li>
          Quando temos o seu consentimento para tratar os seus Dados Pessoais para uma finalidade específica
          ("<strong>Consentimento</strong>").
        </li>
      </ul>

      <p>
        Apresentamos abaixo, em formato de tabela, as bases legais em que nos apoiamos ao tratar os seus Dados
        Pessoais.
      </p>

      <div class="overflow-x-auto rounded-md border border-default">
        <table>
          <thead>
            <tr>
              <th scope="col">
                Finalidade
              </th>

              <th scope="col">
                Categorias de Dados Pessoais
              </th>

              <th scope="col">
                Motivo pelo qual fazemos isto
              </th>

              <th scope="col">
                Nossa base legal
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                Criação de conta
              </td>

              <td>
                <ul>
                  <li>
                    Dados de Identificação
                  </li>

                  <li>
                    Dados de Contacto
                  </li>
                </ul>
              </td>

              <td>
                Para registá-lo como utilizador na Plataforma e gerir a sua conta de utilizador.
              </td>

              <td>
                Necessidade Contratual
              </td>
            </tr>

            <tr>
              <td>
                Verificação
              </td>

              <td>
                <ul>
                  <li>
                    Dados de Identificação
                  </li>

                  <li>
                    Dados de Contacto
                  </li>
                </ul>
              </td>

              <td>
                Para verificar a sua conta através do "Ambo Market Verificado", caso opte por fazê-lo.
              </td>

              <td>
                Necessidade Contratual
              </td>
            </tr>

            <tr>
              <td>
                Operação dos nossos serviços
              </td>

              <td>
                <ul>
                  <li>
                    Dados de Identificação
                  </li>

                  <li>
                    Dados de Contacto
                  </li>

                  <li>
                    Dados de Localização
                  </li>

                  <li>
                    Dados de Anúncios
                  </li>

                  <li>
                    Dados de Chat
                  </li>

                  <li>
                    Dados de Chamadas
                  </li>
                </ul>
              </td>

              <td>
                <p>
                  Para operar a Plataforma e permitir a sua utilização, incluindo possibilitando a interacção com
                  outros utilizadores da Plataforma.
                </p>

                <p>
                  Para prestar outros serviços que nos tenha solicitado (incluindo, por exemplo, a marcação de um
                  test drive através da Ambo Market Cars).
                </p>
              </td>

              <td>
                Necessidade Contratual
              </td>
            </tr>

            <tr>
              <td>
                Análise de dados
              </td>

              <td>
                <ul>
                  <li>
                    Dados Comportamentais
                  </li>

                  <li>
                    Dados Técnicos
                  </li>
                </ul>
              </td>

              <td>
                Para compreender como você e outros utilizadores utilizam a Plataforma e para segmentar a nossa base
                de utilizadores em grupos para fins de marketing.
              </td>

              <td>
                Necessidade Contratual
              </td>
            </tr>

            <tr>
              <td>
                Marketing
              </td>

              <td>
                <ul>
                  <li>
                    Dados de Contacto
                  </li>

                  <li>
                    Dados de Marketing
                  </li>
                </ul>
              </td>

              <td>
                Para lhe enviar mensagens de marketing, quando tiver concordado em recebê-las.
              </td>

              <td>
                Consentimento
              </td>
            </tr>

            <tr>
              <td>
                Resolução de problemas
              </td>

              <td>
                <ul>
                  <li>
                    Dados Técnicos
                  </li>
                </ul>
              </td>

              <td>
                Para identificar problemas que possam estar a ocorrer na nossa Plataforma e resolvê-los.
              </td>

              <td>
                Necessidade Contratual
              </td>
            </tr>

            <tr>
              <td>
                Prevenção de fraude
              </td>

              <td>
                <ul>
                  <li>
                    Dados de Identificação
                  </li>

                  <li>
                    Dados de Contacto
                  </li>
                </ul>
              </td>

              <td>
                Para manter a nossa Plataforma e os sistemas associados operacionais e seguros.
              </td>

              <td>
                Cumprimento da Lei
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      id="personal-data-share"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Com quem partilhamos os seus dados pessoais
      </p>

      <p>
        A tabela abaixo descreve com quem podemos partilhar os seus Dados Pessoais e o motivo pelo qual o fazemos.
      </p>

      <p>
        Exigimos a todos os destinatários dos seus Dados Pessoais que implementem medidas de segurança adequadas
        para os proteger devidamente, em consonância com as nossas políticas e quaisquer obrigações de segurança de
        dados que nos sejam aplicáveis. Não permitimos que os nossos fornecedores de serviços terceiros que tratam os
        seus Dados Pessoais em nosso nome os utilizem para fins próprios, e apenas lhes permitimos tratar os seus
        Dados Pessoais para finalidades específicas e de acordo com as nossas instruções.
      </p>

      <div class="overflow-x-auto rounded-md border border-default">
        <table>
          <thead>
            <tr>
              <th scope="col">
                Destinatários
              </th>

              <th scope="col">
                Motivo pelo qual partilhamos
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                Outros utilizadores da Plataforma
              </td>

              <td>
                <p>
                  Necessitamos de partilhar alguns dos seus Dados Pessoais com outros utilizadores da Plataforma
                  quando pretende realizar transacções com eles através da Plataforma.
                </p>

                <p>
                  Ao publicar um anúncio ou submeter uma avaliação/classificação na nossa Plataforma, essa informação
                  e quaisquer Dados Pessoais associados ao seu perfil de conta (incluindo o seu nome de utilizador,
                  fotografia de perfil e estatuto de Verificado na Ambo Market) serão publicamente acessíveis a, e
                  poderão ser copiados e partilhados externamente por, todos os outros utilizadores da nossa
                  Plataforma. Tais informações podem também aparecer nos resultados de motores de busca de terceiros
                  (por exemplo, resultados do Google). Por favor, certifique-se de que está confortável com a
                  disponibilidade pública dessas informações antes de as submeter na nossa Plataforma.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                Fornecedores de serviços
              </td>

              <td>
                Os nossos fornecedores de serviços prestam-nos uma variedade de serviços necessários para o
                funcionamento da Plataforma (por exemplo, serviços de TI, administração de sistemas ou serviços de
                marketing), podendo ter acesso aos seus Dados Pessoais como resultado disso.
              </td>
            </tr>

            <tr>
              <td>
                Consultores profissionais
              </td>

              <td>
                Os nossos advogados, banqueiros, auditores, seguradoras e outros consultores podem necessitar de
                acesso limitado aos seus Dados Pessoais quando nos prestam serviços de consultoria, bancários,
                jurídicos, de seguros e de contabilidade.
              </td>
            </tr>

            <tr>
              <td>
                Autoridades públicas
              </td>

              <td>
                As autoridades públicas podem exigir-nos que lhes divulguemos dados de utilizadores em determinadas
                circunstâncias, quando exigido por lei (por exemplo, no âmbito de uma investigação policial).
              </td>
            </tr>

            <tr>
              <td>
                Adquirente(s)
              </td>

              <td>
                Podemos partilhar os seus Dados Pessoais com terceiros no caso de qualquer reorganização, fusão,
                venda, joint venture, cessão, transferência ou outra disposição de toda ou parte da nossa actividade,
                para que qualquer potencial adquirente possa continuar a operar a Plataforma. Nesse caso,
                asseguraremos que qualquer destinatário continue a utilizar os seus Dados Pessoais em conformidade
                com esta Política de Privacidade.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="font-semibold text-highlighted">
        Transferências de dados
      </p>

      <p>
        Podemos transferir os seus Dados Pessoais para jurisdições fora do país onde se encontra, que podem não
        oferecer o mesmo nível de protecção de dados que o seu país de origem, conforme necessário para as
        finalidades estabelecidas nesta Política de Privacidade. Asseguraremos sempre que quaisquer transferências
        transfronteiriças dos seus Dados Pessoais cumpram os requisitos aplicáveis.
      </p>
    </div>

    <div
      id="personal-data-secure"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Como mantemos os seus dados pessoais seguros
      </p>

      <p>
        Implementámos medidas de segurança adequadas para evitar que os seus Dados Pessoais sejam acidentalmente
        perdidos, alterados, utilizados ou acedidos de forma não autorizada.
      </p>

      <p>
        Limitamos o acesso aos seus Dados Pessoais aos funcionários e outros colaboradores que tenham necessidade
        profissional de tal acesso. Todas essas pessoas estão sujeitas a uma obrigação contratual de
        confidencialidade.
      </p>

      <p>
        Implementámos procedimentos para lidar com qualquer violação real ou suspeita de Dados Pessoais. Em caso de
        violação, dispomos de sistemas para mitigar qualquer impacto na sua privacidade e para trabalhar com as
        autoridades reguladoras competentes.
      </p>
    </div>

    <div
      id="store-personal-data"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Por quanto tempo conservamos os seus dados pessoais
      </p>

      <p>
        Conservaremos os seus Dados Pessoais apenas pelo tempo que razoavelmente necessitarmos de os utilizar para
        as finalidades estabelecidas nesta Política de Privacidade, salvo se um período de retenção mais longo for
        exigido pela legislação aplicável (por exemplo, para fins regulamentares).
      </p>

      <p>
        Em algumas circunstâncias, podemos anonimizar os seus Dados Pessoais para que já não possam ser associados a
        si. Podemos conservar esses dados anonimizados indefinidamente.
      </p>

      <p>
        As nossas políticas de retenção de dados são revistas em intervalos regulares e cumprem todos os requisitos
        aplicáveis.
      </p>
    </div>

    <div
      id="rights-to-personal-data"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Os seus direitos em relação aos seus dados pessoais
      </p>

      <p class="font-semibold text-highlighted">
        Os seus direitos
      </p>

      <p>
        Em algumas circunstâncias, pode ter determinados direitos em relação aos seus Dados Pessoais. Por exemplo,
        pode ter o direito de:
      </p>

      <ul>
        <li>
          <strong>Solicitar o acesso aos seus Dados Pessoais: </strong>Isto permite-lhe receber uma cópia dos Dados
          Pessoais que detemos sobre si e verificar se os estamos a tratar legalmente.
        </li>

        <li>
          <strong>Solicitar a correcção dos seus Dados Pessoais: </strong>Isto permite-lhe solicitar a correcção de
          quaisquer informações incompletas ou inexactas que detenhamos sobre si.
        </li>

        <li>
          <strong>Solicitar o apagamento dos seus Dados Pessoais: </strong>Isto permite-lhe solicitar que
          eliminemos ou removamos os seus Dados Pessoais dos nossos sistemas quando não houver motivo válido para
          continuarmos a tratá-los.
        </li>

        <li>
          <strong>Opor-se ao tratamento dos seus Dados Pessoais: </strong>Isto permite-lhe opor-se ao tratamento
          dos seus Dados Pessoais para uma finalidade específica (por exemplo, para fins de marketing).
        </li>

        <li>
          <strong>Solicitar a transferência dos seus Dados Pessoais: </strong>Isto permite-lhe solicitar a
          transferência dos seus Dados Pessoais num formato estruturado, de uso corrente e legível por máquina,
          quer para si quer para um terceiro por si designado.
        </li>

        <li>
          <strong>Retirar o seu Consentimento: </strong>Este direito existe apenas quando nos baseamos no seu
          Consentimento para tratar os seus Dados Pessoais. Se retirar o seu Consentimento, poderemos não conseguir
          disponibilizar-lhe o acesso a determinadas funcionalidades da nossa Plataforma. Informá-lo-emos caso seja
          esse o caso no momento em que retirar o seu Consentimento.
        </li>
      </ul>

      <p>
        Note que nem todos os direitos listados acima podem estar disponíveis para si, e alguns direitos podem
        apenas ser exercidos em circunstâncias específicas.
      </p>

      <p class="font-semibold text-highlighted">
        Como exercer os seus direitos
      </p>

      <p>
        Se pretender exercer qualquer um dos direitos descritos acima, por favor contacte-nos.
      </p>

      <p>
        Podemos necessitar de solicitar informações específicas para nos ajudar a confirmar a sua identidade e
        assegurar o seu direito de acesso aos seus Dados Pessoais (ou de exercer qualquer outro dos seus direitos).
        Esta é uma medida de segurança para garantir que os seus Dados Pessoais não sejam divulgados a quem não tem
        direito a recebê-los. Podemos também contactá-lo para solicitar informações adicionais relacionadas com o
        seu pedido, de modo a agilizar a nossa resposta.
      </p>

      <p>
        Procuramos responder a todos os pedidos legítimos no prazo de um mês após a sua recepção. Ocasionalmente,
        poderemos demorar mais de um mês se o seu pedido for particularmente complexo ou se tiver efectuado vários
        pedidos. Nesse caso, notificá-lo-emos e manteremo-lo informado.
      </p>

      <p>
        Embora normalmente não cobremos qualquer taxa pelo exercício dos seus direitos descritos acima, reservamo-nos
        o direito de cobrar uma taxa razoável em algumas circunstâncias (por exemplo, se o seu pedido for
        despropositado ou se submeter um número excessivo de pedidos).
      </p>

      <p class="font-semibold text-highlighted">
        Reclamações
      </p>

      <p>
        Se pretender apresentar uma reclamação relativamente a esta Política de Privacidade ou às nossas práticas em
        relação aos seus Dados Pessoais, por favor contacte-nos. Responderemos à sua reclamação assim que possível.
      </p>

      <p>
        Se não ficar satisfeito com a nossa resposta a qualquer questão que nos coloque, poderá ter o direito de
        apresentar uma reclamação à autoridade de protecção de dados da sua jurisdição.
      </p>
    </div>

    <div
      id="marketing-communications"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Comunicações de Marketing
      </p>

      <p>
        Pode pedir-nos para deixarmos de lhe enviar mensagens de marketing a qualquer momento, iniciando sessão na
        Plataforma e marcando ou desmarcando as caixas relevantes para ajustar as suas preferências de marketing, ou
        seguindo o link "Cancelar subscrição" incluído no final de qualquer e-mail de marketing que receba da nossa
        parte.
      </p>
    </div>

    <div
      id="policy-on-minor"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        A nossa política sobre menores
      </p>

      <p>
        Esta Plataforma não se destina a ser utilizada por menores, e não monitorizamos activamente a idade dos
        nossos utilizadores.
      </p>

      <p>
        Contudo, se tomar conhecimento de que um menor utilizou a Plataforma em violação desta restrição, por favor
        contacte-nos caso pretenda que removamos os seus Dados Pessoais dos nossos sistemas.
      </p>
    </div>

    <div
      id="third-party-links"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Links de terceiros
      </p>

      <p>
        Esta Plataforma pode incluir links para websites e aplicações de terceiros. Clicar nesses links levá-lo-á
        para fora da Plataforma e pode permitir que terceiros recolham ou partilhem os seus Dados Pessoais. Não
        controlamos esses websites e aplicações de terceiros e não somos responsáveis pelas suas práticas de
        privacidade. Quando sair da nossa Plataforma, encorajamo-lo a ler a política de privacidade de cada website
        e aplicação que visitar.
      </p>
    </div>

    <div
      id="changes-to-privacy-policy"
      class="scroll-mt-24 space-y-3 border-t border-default pt-5"
    >
      <p class="font-semibold uppercase tracking-wide text-highlighted">
        Alterações a esta política de privacidade
      </p>

      <p>
        Reservamo-nos o direito de actualizar esta Política de Privacidade a qualquer momento, com ou sem aviso
        prévio.
      </p>

      <p>
        Nesse caso, actualizaremos esta página para apresentar a Política de Privacidade revista e poderemos também,
        em determinadas circunstâncias, notificá-lo (por exemplo, por e-mail).
      </p>

      <p>
        Quaisquer revisões desta Política de Privacidade serão eficazes imediatamente após a sua publicação nesta
        página.
      </p>
    </div>
  </article>
</template>
